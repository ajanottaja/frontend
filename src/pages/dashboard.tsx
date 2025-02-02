import React, { Suspense } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime, Duration } from "luxon";
import { z } from "zod";
import Timer from "../components/atoms/timer";
import { absDuration, isNegativeDuration } from "../utils/date";
import DurationPickerDashboard from "../components/atoms/duration-picker-dashboard";
import {
  dateTimeToIso8601,
  durationToIso8601,
  iso8601ToDateTime,
  iso8601ToDuration,
  tsRangeToObject,
} from "../schema/custom";
import { useClient } from "../supabase/use-client";

/**
 * Target measures the time you want to work on a given day.
 * Specifies hooks to query and mutate the active target (today).
 */

const targetSchema = z.object({
  id: z.string().uuid().optional(),
  date: iso8601ToDateTime,
  duration: iso8601ToDuration,
});

const useActiveTarget = () => {
  const client = useClient();
  return useQuery({
    queryKey: ["activeTarget"],
    queryFn: async () => {
      const { data, error } = await client
        .from("targets")
        .select("id,date,duration::json")
        .eq("date", DateTime.now().toISODate())
        .limit(1);
    if (error) throw error;
      return z.array(targetSchema).parse(data);
    },
  });
};

const targetUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  account: z.string().uuid(),
  date: dateTimeToIso8601,
  duration: durationToIso8601,
});

const useUpsertActiveTarget = () => {
  const client = useClient();
  return useMutation({
    mutationFn: async (args: z.infer<typeof targetSchema>) => {
      const upsertData = targetUpdateSchema.parse({
        ...args,
        account: client.auth.user()?.id,
      });
    const { data, error } = await client
      .from("targets")
      .upsert(upsertData, { onConflict: "date,account" })
      .match({ date: upsertData.date });

    if (error) {
        console.error(error);
      }
      return { data, error };
    },
  });
};

const DashboardTarget = () => {
  const { data, error, refetch } = useActiveTarget();
  const { mutateAsync } = useUpsertActiveTarget();

  if (error) {
    console.error(error);
    return (
      <div display="grid" grid="cols-1" align="self-center">
        <span className="text-red-300 text-2xl font-mono pb-8">
          Could not get target time.
        </span>
      </div>
    );
  }

  const target = data?.[0];

  return (
    <DurationPickerDashboard
      title="Todays target"
      duration={target?.duration}
      setDuration={async (duration: Duration) => {
        const res = await mutateAsync({
          id: target?.id,
          duration,
          date: target?.date ?? DateTime.now(),
        });
        refetch();
      }}
    />
  );
};

/**
 * Interval measures the time you have worked on a given day.
 * Specifies hooks to query and mutate the active interval (today).
 */

const intervalSchema = z.object({
  id: z.string().uuid(),
  tracked: tsRangeToObject,
});

const useActiveTrack = () => {
  const client = useClient();
  return useQuery({
    queryKey: ["activeTrack"],
    queryFn: async () => {
      const { data, error } = await client
        .from("tracks_active")
        .select("id,tracked::json")
        .limit(1);
    if (error) throw error;
      return z.array(intervalSchema).parse(data);
    },
  });
};

const startTrackSchema = z.object({
  multiplier: z.number().optional().default(1.0),
});

const useStartActiveTrack = () => {
  const client = useClient();
  return useMutation({
    mutationFn: async () => {
      const upsertData = startTrackSchema.parse({});
      const { data, error } = await client.rpc("track_start", upsertData);

    if (error) {
      console.error(error);
    }
    return { data, error };
    },
  });
};

const stopTrackSchema = z.object({
  id: z.string().uuid(),
});

const useStopActiveTrack = () => {
  const client = useClient();
  return useMutation({
    mutationFn: async (args: z.infer<typeof stopTrackSchema>) => {
      const { data, error } = await client.rpc("track_stop", args);

    if (error) {
      console.error(error);
    }
    return { data, error };
    },
  });
};

const DashboardTimer = () => {
  const { data, error, refetch } = useActiveTrack();
  const { mutateAsync: startTrack } = useStartActiveTrack();
  const { mutateAsync: stopTrack } = useStopActiveTrack();

  console.log("Data", data);

  if (error) {
    console.error(error);
    return (
      <div display="grid" grid="cols-1" align="self-center">
        <span className="text-red-300 text-2xl font-mono pb-8">
          Could not get target time.
        </span>
      </div>
    );
  }

  const track = data?.[0];

  return (
    <Timer
      title="Timer"
      beginning={track?.tracked.lower}
      startInterval={async () => {
        await startTrack();
        refetch();
      }}
      stopInterval={async () => {
        if (track) await stopTrack({ id: track.id });
        refetch();
      }}
    />
  );
};

/**
 * Summary displays statistics about your tracked time.
 * Uses the summary view to get relevant data.
 */

const summarySchema = z.object({
  title: z.string(),
  target: iso8601ToDuration,
  tracked: iso8601ToDuration,
  diff: iso8601ToDuration,
});

const useSummary = () => {
  const client = useClient();
  return useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const { data, error } = await client
        .from("summary")
        .select("title,period,target::json,tracked::json,diff::json");
      if (error) throw error;
      return z.array(summarySchema).parse(data);
    },
  });
};

const DashboardStats = () => {
  // Get statistics summary and refresh every minute
  const { data, isLoading, error } = useSummary();

  if (error) console.error(error);

  if (error) {
    return (
      <div display="grid" grid="cols-1" align="self-center">
        <span className="text-red-300 text-2xl font-mono pb-8">
          Could not get summary of tracked time.
        </span>
      </div>
    );
  }

  if (data) {
    const summary = {
      day: data.find((d) => d.title === "day"),
      week: data.find((d) => d.title === "week"),
      month: data.find((d) => d.title === "month"),
      year: data.find((d) => d.title === "year"),
      all: data.find((d) => d.title === "all"),
    };

    const formatDuration = (
      d: Duration | undefined = Duration.fromMillis(0),
      format: string
    ) =>
      `${isNegativeDuration(d) ? "- " : ""}${absDuration(d).toFormat(format)}`;

    return (
      <div
        h="full"
        display="grid"
        grid="cols-1 gap-y-1"
        justify="self-center items-stretch"
        text="center xl <lg:base"
      >
        <h2 text="4xl <lg:3xl center dark:gray-300" m="b-4" align="self-start">
          Time summary
        </h2>
        <span text="gray-300" m="0">
          Day: {formatDuration(summary.day?.diff, "h 'hours' m 'minutes'")}
        </span>
        <span text="gray-300" m="0">
          Week: {formatDuration(summary.week?.diff, "h 'hours' m 'minutes'")}
        </span>
        <span text="gray-300" m="0">
          Month:{" "}
          {formatDuration(
            summary.month?.diff,
            "d 'days' h 'hours' m 'minutes'"
          )}
        </span>
        <span text="green-300" m="0">
          Year:{" "}
          {formatDuration(summary.year?.diff, "d 'days' h 'hours' m 'minutes'")}
        </span>
        <span text="green-300" m="0">
          All:{" "}
          {formatDuration(summary.all?.diff, "d 'days' h 'hours' m 'minutes'")}
        </span>
      </div>
    );
  }

  return <div>Fetching</div>;
};

const Dashboard = () => {
  return (
    <div
      w="full"
      display="flex"
      flex="col"
      justify="center"
      align="items-center"
      h="full"
      m="<sm:t-8"
    >
      <div
        justify="self-center items-center"
        align="self-center items-center"
        display="grid"
        grid="cols-3 <lg:cols-1 lg:gap-x-32 <lg:gap-y-8"
        p="<lg:x-4"
      >
        <Suspense
          fallback={
            <div className="flex flex-col items-center text-green-300 text-4xl">
              <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
              <div>Loading</div>
            </div>
          }
        >
          <DashboardTarget />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col items-center text-green-300 text-4xl">
              <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
              <div>Loading</div>
            </div>
          }
        >
          <DashboardTimer />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col items-center text-green-300 text-4xl">
              <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
              <div>Loading</div>
            </div>
          }
        >
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
