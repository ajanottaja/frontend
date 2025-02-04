import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, { useState } from "react";

interface TimePicker {
  dateTime?: DateTime;
  setDateTime: (time: DateTime) => void;
}

const TimePicker = ({ dateTime, setDateTime }: TimePicker) => {
  const [timeValue, setTimeValue] = useState(() => {
    return dateTime?.toFormat('HH:mm') ?? DateTime.now().toFormat('HH:mm');
  });

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
  };

  const handleBlur = () => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDateTime = (dateTime ?? DateTime.now()).set({ 
      hour: hours, 
      minute: minutes 
    });
    setDateTime(newDateTime);
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

export default TimePicker;
