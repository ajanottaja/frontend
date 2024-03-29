import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { Button, IconButton } from "./button";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

interface Timer {
  beginning?: DateTime;
  title?: string;
  startInterval: () => void;
  stopInterval: () => void;
}

const formatDigits = (digits: number) => {
  return digits.toString().padStart(2, "0");
};

const Timer = ({ beginning, title, startInterval, stopInterval }: Timer) => {
  const [time, setTime] = useState(DateTime.now());
  const duration = time.diff(beginning ? beginning : DateTime.now(), [
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
  ]);

  useEffect(() => {
    const interval = setInterval(() => setTime(DateTime.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [beginning]);

  return (
    <div display="grid" grid="cols-1 gap-y-8 <lg:gap-y-4" justify="self-center">
      {title && <h2 text="4xl <lg:3xl center dark:gray-300">{title}</h2>}
      <span
        className={`${beginning ? "text-gray-300" : "text-gray-700"} font-mono`}
        text="6xl <lg:4xl"
      >
        <span>{formatDigits(duration.hours ?? 0)}</span>
        <span animate="pulse duration-2s">:</span>
        <span>{formatDigits(duration.minutes ?? 0)}</span>
        <span animate="pulse duration-2s">:</span>
        <span>{formatDigits(duration.seconds ?? 0)}</span>
      </span>
      {beginning ? (
        <IconButton
          icon={faStop}
          ariaLabel="Start interval"
          onClick={async () => {
            await stopInterval();
          }}
        >
          Stop interval
        </IconButton>
      ) : (
        <IconButton
          icon={faPlay}
          ariaLabel="Start interval"
          onClick={async () => {
            await startInterval();
          }}
        >
          Start interval
        </IconButton>
      )}
    </div>
  );
};

export default Timer;
