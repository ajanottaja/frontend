import React, { useEffect, useState, Suspense } from "react";
import logo from "./logo.svg";
import {
  Auth0ContextInterface,
  useAuth0,
  User,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";
import Header from "../layout/header";
import { startInterval, stopInterval } from "../../api";
import DurationInput from "../atoms/duration-form";
import Timer from "../atoms/timer";
import { DateTime, Duration } from "luxon";
import { useActiveInterval } from "../../api/interval";
import { upsertActiveTarget, useActiveTarget } from "../../api/target";

const DashboardTarget = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  const {
    data,
    error,
    mutate,
  } = useActiveTarget(auth0);

  return <DurationInput
    activeTarget={data?.status === 200 ? data.body.duration : undefined}
    setActiveTarget={async (duration: Duration) => {
      const date = DateTime.now();
      const res = await upsertActiveTarget({auth0, params: {duration, date}});
      console.log(res);
      mutate();
    }}
  />;
};

const DashboardTimer = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  const {
    data,
    error,
    mutate,
  } = useActiveInterval(auth0);

  console.log(data);

  if (data) {
    return (
      <Timer
        beginning={
          data?.status === 200
            ? data.body.interval.beginning
            : undefined
        }
        startInterval={async () => {
          await startInterval(auth0);
          mutate();
        }}
        stopInterval={async () => {
          await stopInterval(auth0);
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
  return (
    <div display="grid" grid="cols-1" align="self-center">
      <span className="text-gray-300 text-2xl font-mono align-center">
        Fancy graph coming here
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
    <div
      display="flex"
      flex="col"
      align="items-center"
      justify="start"
      h="full"
    >
      <Header />
      <div display="flex" flex="col" justify="content-center" h="full">
        <div
          w="max-w-7xl screen"
          justify="self-center items-center"
          align="self-center items-self-stretch"
          display="grid"
          grid="cols-3 <lg:cols-1 lg:gap-x-32 <lg:gap-y-16"
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
    </div>
  );
};

export default Dashboard;
