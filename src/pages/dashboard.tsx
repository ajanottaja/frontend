import React, { Suspense, useRef, useEffect, useState, Fragment } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../components/atoms/button";
import StatCard from "../components/atoms/stat-card";

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
      // Get the user ID using the new async method
      const { data: { user } } = await client.auth.getUser();
      if (!user) console.error("User not authenticated");
      if (!user) throw new Error("User not authenticated");

      const { id, ...dataWithoutId } = targetUpdateSchema.parse({
        ...args,
        account: user.id,
      });

      // Create explicit object with or without id to avoid undefined properties
      const upsertData = id 
        ? { ...dataWithoutId, id }
        : dataWithoutId;

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
  const [isOpen, setIsOpen] = useState(false);

  if (error) {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center">
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
      isOpen={isOpen}
      close={() => setIsOpen(false)}
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

/**
 * Default target duration of 8 hours
 */
const DEFAULT_TARGET = Duration.fromObject({ hours: 8 });

/**
 * Simplified dashboard timer that handles both display and controls
 */
const ProgressBar = ({ progress }: { progress: number }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transform = 'scaleX(0)';
      // Force a reflow before applying the new transform
      void progressRef.current.offsetWidth;
      progressRef.current.style.transform = `scaleX(${Math.min(1, progress)})`;
    }
  }, [progress]);

  return (
    <div className="relative w-full bg-stone-800 rounded-full h-2 overflow-hidden">
      <div 
        ref={progressRef}
        className="absolute top-0 left-0 w-full bg-green-600 h-full rounded-full transition-transform duration-1000 ease-out origin-left"
      />
    </div>
  );
};

const TargetEditDialog = ({
  isOpen,
  onClose,
  target,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  target?: Duration;
  onUpdate: (duration: Duration) => Promise<void>;
}) => {
  return (
    <DurationPickerDashboard
      title="Edit Daily Target"
      duration={target}
      isOpen={isOpen}
      close={onClose}
      setDuration={onUpdate}
    />
  );
};

const DashboardTimer = () => {
  const { data: targetData, refetch: refetchTarget } = useActiveTarget();
  const { data: trackData, error, refetch: refetchTrack } = useActiveTrack();
  const { data: summaryData, refetch: refetchSummary } = useSummary();
  const { mutateAsync: startTrack } = useStartActiveTrack();
  const { mutateAsync: stopTrack } = useStopActiveTrack();
  const { mutateAsync: upsertTarget } = useUpsertActiveTarget();
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="text-red-300 text-2xl font-mono pb-8">
          Could not connect to server
        </span>
      </div>
    );
  }

  const track = trackData?.[0];
  const target = targetData?.[0];
  const todaySummary = summaryData?.find(d => d.title === "day");

  // Get total tracked time from summary, plus current active session if any
  const activeSessionDuration = track?.tracked.lower 
    ? DateTime.now().diff(track.tracked.lower, ['hours', 'minutes'])
    : Duration.fromMillis(0);
  
  // Only add active session if we don't have summary data yet
  const totalTrackedDuration = todaySummary 
    ? todaySummary.tracked 
    : activeSessionDuration;

  const progress = totalTrackedDuration.as('hours') / (target?.duration.as('hours') ?? 0);

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xl mx-auto">
      <Timer
        title="TIME TRACKED TODAY"
        beginning={track?.tracked.lower}
        startInterval={async () => {
          // Create default target if none exists
          if (!targetData?.[0]) {
            await upsertTarget({
              duration: DEFAULT_TARGET,
              date: DateTime.now(),
            });
            await refetchTarget();
          }
          await startTrack();
          await Promise.all([
            refetchTrack(),
            refetchSummary()
          ]);
        }}
        stopInterval={async () => {
          if (track) await stopTrack({ id: track.id });
          await Promise.all([
            refetchTrack(),
            refetchSummary()
          ]);
        }}
      />
      
      {/* Show progress towards target */}
      {target && (
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-300">{totalTrackedDuration.toFormat("h'h' m'm'")}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">of {target.duration.toFormat("h'h'")}</span>
              <IconButton
                icon={faPencil}
                ariaLabel="Edit target"
                className="!p-1 !px-2 text-xs"
                onClick={() => setIsEditingTarget(true)}
              />
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
      )}

      <TargetEditDialog
        isOpen={isEditingTarget}
        onClose={() => setIsEditingTarget(false)}
        target={target?.duration}
        onUpdate={async (duration) => {
          await upsertTarget({
            id: target?.id,
            duration,
            date: target?.date ?? DateTime.now(),
          });
          await Promise.all([
            refetchTarget(),
            refetchSummary()
          ]);
        }}
      />
    </div>
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
  const { data, error } = useSummary();

  if (error) {
    return (
      <div className="text-red-300 text-center">
        Could not get summary of tracked time.
      </div>
    );
  }

  if (data) {
    const summary = {
      day: data.find((d) => d.title === "day"),
      week: data.find((d) => d.title === "week"),
      month: data.find((d) => d.title === "month"),
      year: data.find((d) => d.title === "year"),
      allTime: data.find((d) => d.title === "all"),
    };

    return (
      <div className="flex flex-wrap justify-center gap-6 w-full">
        <div className="flex flex-1 min-w-fit">
          <StatCard
            title="Today"
            tracked={summary.day?.tracked ?? Duration.fromMillis(0)}
            target={summary.day?.target ?? Duration.fromMillis(0)}
          />
        </div>
        <div className="flex flex-1 min-w-fit">
          <StatCard
            title="This Week"
            tracked={summary.week?.tracked ?? Duration.fromMillis(0)}
            target={summary.week?.target ?? Duration.fromMillis(0)}
          />
        </div>
        <div className="flex flex-1 min-w-fit">
          <StatCard
            title="This Month"
            tracked={summary.month?.tracked ?? Duration.fromMillis(0)}
            target={summary.month?.target ?? Duration.fromMillis(0)}
          />
        </div>
        <div className="flex flex-1 min-w-fit">
          <StatCard
            title="This Year"
            tracked={summary.year?.tracked ?? Duration.fromMillis(0)}
            target={summary.year?.target ?? Duration.fromMillis(0)}
          />
        </div>
        <div className="flex flex-1 min-w-fit">
          <StatCard
            title="All Time"
            tracked={summary.allTime?.tracked ?? Duration.fromMillis(0)}
            target={summary.allTime?.target ?? Duration.fromMillis(0)}
          />
        </div>
      </div>
    );
  }

  return <div className="text-gray-300">Loading statistics...</div>;
};

/**
 * Simplified dashboard that focuses on the timer
 */
const Dashboard = () => {
  return (
    <div className="w-full max-w-8xl mx-auto py-4 space-y-12">
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

      <div className="mt-12 pt-12 border-t border-stone-800">
        <Suspense fallback={<div className="text-gray-300">Loading stats...</div>}>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
