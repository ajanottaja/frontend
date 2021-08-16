import React, { useEffect, useState } from "react";
import { intervalToDuration, parseISO, formatDuration } from 'date-fns';
import { Button, IconButton } from "./button";

interface Timer {
  beginning?: string;
  startInterval: () => void;
  stopInterval: () => void;
}

const formatDigits = (digits: number) => {
  return digits.toString().padStart(2, "0");
}

const Timer = ({ beginning, startInterval, stopInterval }: Timer) => {

  const [time, setTime] = useState(new Date());
  const duration = intervalToDuration({ start: beginning ? parseISO(beginning) : new Date(), end: time });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [beginning]);

  return <div display="grid" grid="cols-1 gap-y-8" justify="self-center">
    <h2 text="4xl center dark:gray-300">Timer</h2>
    <span className={`${beginning ? "text-green-300" : "text-gray-700"} text-6xl font-mono`}>
      <span>{formatDigits(duration.hours ?? 0)}</span>
      <span animate="pulse duration-2s">:</span>
      <span>{formatDigits(duration.minutes ?? 0)}</span>
      <span animate="pulse duration-2s">:</span>
      <span>{formatDigits(duration.seconds ?? 0)}</span>
    </span>
    {beginning ?
      <IconButton icon="icon-play-stop" ariaLabel="Start interval" onClick={async () => {
        await stopInterval();
      }}>
        Stop interval
      </IconButton> :
      <IconButton icon="icon-play-button" ariaLabel="Start interval" onClick={async () => {
        await startInterval();
      }}>
        Start interval
      </IconButton>}


  </div>
}

export default Timer;