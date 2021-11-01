import React, { useEffect, useState, Suspense } from "react";
import {
  Auth0ContextInterface,
  useAuth0,
  User,
} from "@auth0/auth0-react";
import DurationInput from "../components/atoms/duration-form";
import Timer from "../components/atoms/timer";
import { DateTime, Duration } from "luxon";
import {
  startInterval,
  stopInterval,
  useActiveInterval,
} from "../api/interval";
import { createTarget, useActiveTarget } from "../api/target";
import { useStatisticsSummary } from "../api/statistics";
import { absDuration, isNegativeDuration } from "../utils/date";

const DashboardTarget = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  const { data, error, mutate } = useActiveTarget(auth0);

  return (
    <DurationInput
      activeTarget={data?.status === 200 ? data.body.duration : undefined}
      setActiveTarget={async (duration: Duration) => {
        const date = DateTime.now();
        const res = await createTarget({
          auth0,
          body: { duration, date },
        });
        mutate();
      }}
    />
  );
};

const DashboardTimer = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  const { data, error, mutate } = useActiveInterval(auth0);

  if (data) {
    return (
      <Timer
        beginning={
          data?.status === 200 ? data.body.interval.beginning : undefined
        }
        startInterval={async () => {
          await startInterval({ auth0 });
          mutate();
        }}
        stopInterval={async () => {
          await stopInterval({ auth0 });
          mutate();
        }}
      />
    );
  }

  return (
    <span className="text-red-300 text-2xl font-mono pb-8">
      Could not check for active time intervals
    </span>
  );
};

const DashboardStats = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  // Get statistics summary and refresh every minute
  const { data, error } = useStatisticsSummary(auth0, {
    refreshInterval: 60 * 1000,
  });

  if (error || data?.status !== 200) {
    return (
      <div display="grid" grid="cols-1" align="self-center">
        <span className="text-red-300 text-2xl font-mono pb-8">
          Could not get summary of tracked time.
        </span>
      </div>
    );
  }

  const summary = {
    day: data.body.find((d) => d.unit === "day"),
    week: data.body.find((d) => d.unit === "week"),
    month: data.body.find((d) => d.unit === "month"),
    all: data.body.find((d) => d.unit === "all")
  };

  const formatDuration = (
    d: Duration | undefined = Duration.fromMillis(0),
    format: string
  ) => `${isNegativeDuration(d) ? "- " : ""}${absDuration(d).toFormat(format)}`;

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
        Week:{" "}
        {formatDuration(summary.week?.diff, "h 'hours' m 'minutes'")}
      </span>
      <span text="gray-300" m="0">
        Month:{" "}
        {formatDuration(summary.month?.diff, "d 'days' h 'hours' m 'minutes'")}
      </span>
      <span text="green-300" m="0">
        All time:{" "}
        {formatDuration(summary.all?.diff, "d 'days' h 'hours' m 'minutes'")}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const auth0 = useAuth0();

  if (auth0.isLoading) {
    return <div>Is loading</div>;
  }

  if (auth0.error) {
    return <div>Authentication error</div>;
  }

  if (!auth0.isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div w="full" display="flex" flex="col" justify="center" align="items-center" h="full" m="<sm:t-8">
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
            <DashboardTarget auth0={auth0} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex flex-col items-center text-green-300 text-4xl">
                <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
                <div>Loading</div>
              </div>
            }
          >
            <DashboardTimer auth0={auth0} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex flex-col items-center text-green-300 text-4xl">
                <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
                <div>Loading</div>
              </div>
            }
          >
            <DashboardStats auth0={auth0} />
          </Suspense>
        </div>
      </div>
  );
};

export default Dashboard;
