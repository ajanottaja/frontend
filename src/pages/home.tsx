import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import DurationPickerDashboard from "../components/atoms/duration-picker-dashboard";
import Timer from "../components/atoms/timer";
import { MonthHeader } from "../components/layout/calendar/headers";
import { MonthCalendar } from "../components/organisms/calendar";
import { Target, Track } from "../schema/calendar";
import { daysOfMonth, tracksOnDate } from "../utils/date";
import { randomInt } from "../utils/functions";

const TimerDemo = () => {
  const [beginning, setBeginning] = useState<DateTime>();
  return (
    <Timer
      beginning={beginning}
      startInterval={() => setBeginning(DateTime.now())}
      stopInterval={() => setBeginning(undefined)}
    />
  );
};

const CalendarDemo = () => {
  const today = DateTime.now().startOf("day").plus({ hours: 6 });
  const dates = daysOfMonth(today).map((date) => {
    const numTracks = randomInt(0, 3);
    const tracks = tracksOnDate(date, numTracks).map((i) => ({
      id: i.lower.toMillis().toString(),
      tracked: i,
    }));
    const target: Target =
      numTracks > 0
        ? {
            date,
            id: date.toISODate(),
            duration: Duration.fromObject({ hours: randomInt(5, 8) }),
          }
        : {
          date,
          id: date.toISODate(),
          duration: Duration.fromObject({ hours: 0 }),
        };

    return {
      date,
      target,
      tracks,
    };
  });
  return (
    <div w="min-full">
      <MonthHeader />
      <MonthCalendar date={today} dates={dates} />
    </div>
  );
};

interface Row {
  direction: "left" | "right";
  title: string;
  description: string;
  demo: React.ReactNode | React.ReactNode[];
}

const Row = ({ direction, title, description, demo }: Row) => (
  <div
    w="min-full max-full"
    gradient={
      direction === "left"
        ? "to-r from-green-700 to-teal-700"
        : "to-l from-green-700 to-teal-700"
    }
    border="rounded-lg"
    transform={direction === "left" ? "~ -rotate-2" : "~ rotate-2"}
    p="16 <sm:8"
    m="b-32"
  >
    <div
      bg="dark-800"
      display="flex"
      flex={`<sm:col ${direction === "left" ? "row" : "row-reverse"}`}
      align="items-center"
      justify="between"
      p="8"
      border="rounded-md"
      transform={direction === "left" ? "~ rotate-2" : "~ -rotate-2"}
    >
      <div
        display="flex"
        flex="col"
        align="items-start"
        text="left <sm:center"
        w="1/2 <sm:full"
        m="<sm:b-8"
      >
        <h2 text="gray-300 4xl <sm:3xl" p="b-2" w="full">
          {title}
        </h2>
        <p text="gray-400">{description}</p>
      </div>
      <div display="flex" shadow="lg dark-dark-100">
        {demo}
      </div>
    </div>
  </div>
);

const Home = () => {
  const [target, setTarget] = useState<Duration>();

  return (
    <div
    display="flex"
    flex="col"
    align="center"
    justify="start"
    w="max-screen-lg full"
    p="<sm:x-8"
  >
      <h1 text="green-300 5xl uppercase" font="tracking-widest" p="t-16 b-24">
        Ajanottaja
      </h1>

      <Row
        direction="left"
        title="An intuitive timer"
        description={`
            Just like your grandfather's stop watch, a simple click and away you go!
            Watch as the seconds tick away as time slowly accumulates.
            Ajanottaja will faitfully keep track of time until you stop the watch.`}
        demo={<TimerDemo />}
      />

      <Row
        direction="right"
        title="Choose your targets"
        description={`
            Aim high, but not so high as to burn yourself out.
            Ajanottaja will help you keep track of your daily goals.
            This way you know when to take a few hours off your day. Or if you need to put in a few extra hours.
          `}
        demo={
          <DurationPickerDashboard duration={target} setDuration={setTarget} />
        }
      />

      <div
        w="min-full"
        display="flex"
        flex="col"
        align="items-center"
        justify="center"
        m="b-16"
      >
        <h2 text="gray-300 4xl <sm:3xl" p="b-2" w="full">
          A calendar for the ages
        </h2>
        <p text="gray-400" m="b-16">
          Don't worry, your logged time and targets are a fingertip away.
          Ajanottaja's digital calendar will help you housekeep your logged time
          and targets. Should you wish to you can edit or delete your tracked
          time and targets.
        </p>
        <CalendarDemo />
      </div>

      <div display="flex" justify="center" m="b-16">
        <a
          w="max-content"
          gradient="to-l from-green-800 to-teal-800"
          border="rounded-md"
          p="4"
          text="gray-300"
          href="/register"
        >
          Register now!
        </a>
      </div>
    </div>
  );
};

export default Home;
