import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import useSWR, { mutate } from 'swr';
import { DateTime, Duration } from "luxon";
import Header from '../layout/header';
import { startInterval, stopInterval, useActiveInterval } from '../../api';
import Button from '../atoms/button';

const Dashboard = () => {

  const [time, setTime] = useState(DateTime.now());
  const auth0 = useAuth0();
  const { data, error, mutate } = useActiveInterval(auth0);


  useEffect(() => {
    const interval = setInterval(() => setTime(DateTime.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  let duration;
  if (!error && data && data.status === 200) {
    const start = DateTime.fromISO(data.body.interval.beginning);
    duration = time.diff(start);
  }

  return <div className="grid min-h-screen">
    <Header />
    <div className="flex flex-row max-w-7xl mx-auto px-4">
      <div className="flex flex-col items-center">
        {duration ?
          <>
            <span className="text-green-300 text-4xl font-mono pb-8">{duration?.toFormat('hh:mm:ss')}</span>
            <Button onClick={async () => {
              await stopInterval(auth0);
              mutate();
            }}>
              Stop interval
            </Button>
          </> : <>
            <span className="text-green-300 text-2xl font-mono pb-8">Not tracking anything :(</span>
            <Button onClick={async () => {
              await startInterval(auth0);
              mutate();
            }}>
              Start new interval
            </Button></>}
      </div>

      {JSON.stringify(error, null, 2)}
    </div>
  </div>

}

export default withAuthenticationRequired(Dashboard, { returnTo: window.origin });