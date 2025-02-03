import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Duration } from "luxon";
import React, { useState } from "react";

interface DurationPicker {
  duration?: Duration;
  setDuration: (duration: Duration) => void;
}

const DurationPicker = ({ duration, setDuration }: DurationPicker) => {
  const [timeValue, setTimeValue] = useState(() => {
    const hours = duration?.hours ?? 0;
    const minutes = duration?.minutes ?? 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
  };

  const handleBlur = () => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDuration = Duration.fromObject({ hours, minutes });
    setDuration(newDuration);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FontAwesomeIcon 
          icon={faClock} 
          className="text-green-400/75"
        />
      </div>
      <input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        className={`
          w-full pl-12 pr-4 py-3
          bg-stone-800/75 border border-stone-700/50 rounded-xl
          text-gray-300 transition-all duration-200
          hover:bg-stone-800 
          focus:outline-none focus:ring-2 focus:ring-green-500/30
          [&::-webkit-calendar-picker-indicator]:bg-none
          [&::-webkit-calendar-picker-indicator]:hidden
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-clear-button]:hidden
        `}
      />
    </div>
  );
};

export default DurationPicker;
