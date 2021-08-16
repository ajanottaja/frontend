import React, { useEffect, useState, Suspense } from 'react'
import logo from './logo.svg'
import { Auth0ContextInterface, useAuth0, User, withAuthenticationRequired } from '@auth0/auth0-react';
import useSWR, { mutate } from 'swr';
import Header from '../layout/header';
import { startInterval, stopInterval, useActiveInterval } from '../../api';
import DurationInput from '../atoms/duration-form';
import Timer from '../atoms/timer';



const DashboardTarget = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  return <DurationInput />
}


const DashboardTimer = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {
  const { data: activeData, error: activeError, mutate: activeMutate } = useActiveInterval(auth0);
  if (activeData) {
    return <Timer
      beginning={activeData?.status === 200 ? activeData.body.interval.beginning : undefined}
      startInterval={async () => {
        await startInterval(auth0);
        activeMutate();
      }}
      stopInterval={async () => {
        await stopInterval(auth0);
        activeMutate();
      }}
    />
  }

  return <span className="text-red-300 text-2xl font-mono pb-8">Could not check for active time intervals</span>;
}

const DashboardStats = ({ auth0 }: { auth0: Auth0ContextInterface<User> }) => {

  return <div display="grid" grid="cols-1" align="self-center"><span className="text-gray-300 text-2xl font-mono align-center">Fancy graph coming here</span></div>;
}


const Dashboard = () => {
  const auth0 = useAuth0();

  return <div display="flex" pos="relative" flex="col" justify="content-center" h="min-screen">
    <Header />
    <div w="max-w-7xl screen" display="grid" grid="cols-3 <lg:cols-1 lg:gap-x-32 <lg:gap-y-16" align="self-center"> 
      <Suspense fallback={<div className="flex flex-col items-center text-green-300 text-4xl">
        <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
        <div>Loading</div>
      </div>}>
        <DashboardTarget auth0={auth0} />
      </Suspense>
      <Suspense fallback={<div className="flex flex-col items-center text-green-300 text-4xl">
        <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
        <div>Loading</div>
      </div>}>
        <DashboardTimer auth0={auth0} />
      </Suspense>
      <Suspense fallback={<div className="flex flex-col items-center text-green-300 text-4xl">
        <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
        <div>Loading</div>
      </div>}>
        <DashboardStats auth0={auth0} />
      </Suspense>
    </div>
  </div>

}

export default withAuthenticationRequired(Dashboard, { returnTo: window.origin });