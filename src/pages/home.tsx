import { useAuth0 } from "@auth0/auth0-react";
import { DateTime, Duration } from "luxon";
import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router";
import { date } from "superstruct";
import { IntervalRecord, TargetRecord } from "../api/calendar";
import DurationPickerDashboard from "../components/atoms/duration-picker-dashboard";
import Timer from "../components/atoms/timer";
import { MonthHeader } from "../components/layout/calendar/headers";
import Header from "../components/layout/header";
import { MonthCalendar } from "../components/organisms/calendar";
import { daysOfMonth, intervalsOnDate } from "../utils/date";
import { randomInt } from "../utils/functions";


const TimerDemo = () => {
  const [beginning, setBeginning] = useState<DateTime>();
  return <Timer beginning={beginning} startInterval={() => setBeginning(DateTime.now())} stopInterval={() => setBeginning(undefined)} />

}

const CalendarDemo = () => {
  const today = DateTime.now().startOf("day").plus({hours: 6});
  const dates = daysOfMonth(today).map(date => {
    const numIntervals = randomInt(0, 3);
    const intervals = intervalsOnDate(today, numIntervals).map(i => ({ id: i.beginning.toISODate(), interval: i}));
    const target: TargetRecord | null = numIntervals > 0 ? { date, id: date.toISODate(), duration: Duration.fromObject({hours: randomInt(5,8)})} : null;
    
    return {
      date,
      target,
      intervals: intervals,
    }
  });
  return <div w="min-full">
    <MonthHeader />
    <MonthCalendar date={today} dates={dates} />
  </div>
}


const Home = () => {
  const [target, setTarget] = useState<Duration>();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated]);

  return (
    <div
      display="flex"
      flex="col"
      w="full"
      justify="items-center"
      align="items-center"
    >
      <div
        display="flex"
        flex="col"
        align="center"
        justify="start"
        w="max-screen-lg full"
        p="<sm:x-8"
      >
        <h1
          text="green-300 5xl uppercase"
          font="tracking-widest"
          p="t-16 b-24"
        >
          Ajanottaja
        </h1>

        <div w="min-full max-full" display="flex" flex="row <sm:col" align="items-center" justify="between" p="b-24">
          <div display="flex" flex="col" align="items-start" text="left <sm:center" w="1/2 <sm:full" m="<sm:b-8">
            <h2 text="gray-300 4xl <sm:3xl" p="b-2" w="full">An intuitive timer</h2>
            <p text="gray-400">
              Just like your grandfather's stop watch, a simple click and away you go!
              Watch as the seconds tick away as time slowly accumulates.
              Ajanottaja will faitfully keep track of time until you stop the watch. 
            </p>
          </div>
          <div display="flex" transform="" shadow="lg dark-dark-100">
            <TimerDemo />
          </div>
        </div>

        <div w="min-full max-full" display="flex" flex="row-reverse <sm:col" align="items-center" justify="between" p="b-24">
          <div display="flex" flex="col" align="items-start" text="left <sm:center" w="1/2 <sm:full"  m="<sm:b-8">
            <h2 text="gray-300 4xl <sm:3xl" p="b-2" w="full">Choose your targets</h2>
            <p text="gray-400">
              Aim high, but not so high as to burn yourself out.
              Ajanottaja will help you keep track of your daily goals.
              This way you know when to take a few hours off your day.
              Or if you need to put in a few extra hours.
            </p>
          </div>
          <div display="flex" transform="" shadow="lg dark-dark-100">
            <DurationPickerDashboard duration={target} setDuration={(duration) => setTarget(duration)} />
          </div>
        </div>

        <div w="min-full max-full" display="flex" flex="col" align="items-center" justify="center">
          <h2 text="gray-300 4xl <sm:3xl" p="b-2" w="full">A calendar for the ages</h2>
          <p text="gray-400" m="b-16">
            Don't worry, your logged time and targets are a fingertip away.
            Ajanottaja's digital calendar will help you housekeep your logged time and targets.
            Should you wish to you can edit or delete your tracked time and targets.
          </p>
          <CalendarDemo  />
        </div>
      </div>
    </div>
  );
};

export default Home;
