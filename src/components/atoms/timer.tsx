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
    <div className="flex flex-col items-center gap-6">
      {title && <h2 className="text-gray-400 text-sm font-medium">{title}</h2>}
      <div className="bg-stone-800/50 rounded-xl p-8 w-full">
        <span className={`${beginning ? "text-gray-300" : "text-gray-700"} font-mono text-5xl flex justify-center`}>
          <span>{formatDigits(duration.hours ?? 0)}</span>
          <span className="text-gray-500 mx-2">:</span>
          <span>{formatDigits(duration.minutes ?? 0)}</span>
          <span className="text-gray-500 mx-2">:</span>
          <span>{formatDigits(duration.seconds ?? 0)}</span>
        </span>
      </div>
      <IconButton
        icon={beginning ? faStop : faPlay}
        ariaLabel={beginning ? "Stop interval" : "Start interval"}
        onClick={async () => {
          if (beginning) {
            await stopInterval();
          } else {
            await startInterval();
          }
        }}
        className={`w-full ${beginning 
          ? 'text-red-400 hover:text-red-300' 
          : 'text-green-400 hover:text-green-300'
        }`}
      >
        {beginning ? "Stop" : "Start"}
      </IconButton>
    </div>
  );
};

export default Timer;
