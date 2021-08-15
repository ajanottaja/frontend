import React, { useEffect, useState, Suspense } from 'react'
import logo from './logo.svg'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import useSWR, { mutate } from 'swr';
import Header from '../layout/header';
import { startInterval, stopInterval, useActiveInterval } from '../../api';
import DurationInput from '../atoms/duration-form';
import Timer from '../atoms/timer';


const DashboardInner = () => {
  const auth0 = useAuth0();
  const { data: activeData, error: activeError, mutate: activeMutate } = useActiveInterval(auth0);

  return <div className="flex flex-col max-w-1/2">
    <DurationInput />
    {activeData &&
      <Timer
        beginning={activeData?.status === 200 ? activeData.body.interval.beginning : undefined}
        startInterval={async () => {
          await startInterval(auth0);
          activeMutate();
        }}
        stopInterval={async () => {
          await stopInterval(auth0);
          activeMutate();
        }}
      />}
    {activeError && <>
      <span className="text-red-300 text-2xl font-mono pb-8">Could not check for active time intervals</span>
    </>}
    <div className="flex flex-col max-w-1/2">
    </div>
  </div>
}

const Dashboard = () => {

  return <div className="grid min-h-screen">
    <Header />
    <div className="flex flex-row mx-auto px-4">
      <div className="flex flex-col items-center min-w-7xl max-w-7xl">
        <Suspense fallback={<div className="flex flex-col items-center text-green-300 text-4xl">
          <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
          <div>Loading</div>
        </div>}>
          <DashboardInner />
        </Suspense>
      </div>
    </div>
  </div>

}

export default withAuthenticationRequired(Dashboard, { returnTo: window.origin });