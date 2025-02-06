import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface DurationPickerBase {
  hours: string;
  minutes: string;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  textSize?: string;
}

const validateTimeInput = (value: string, isHours: boolean): { value: string; error?: string } => {
  const cleaned = value.replace(/[^\d]/g, '');
  if (!cleaned) return { value: cleaned };
  
  const num = parseInt(cleaned);
  if (isHours) {
    return num > 24 
      ? { value: cleaned, error: 'Maximum 24 hours' }
      : { value: cleaned };
  } else {
    return num > 59 
      ? { value: cleaned, error: 'Maximum 59 minutes' }
      : { value: cleaned };
  }
};

const DurationPickerBase = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  onBlur,
  className = "",
  textSize = "text-base"
}: DurationPickerBase) => {
  const [hoursError, setHoursError] = useState<string>();
  const [minutesError, setMinutesError] = useState<string>();

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, error } = validateTimeInput(e.target.value, true);
    onHoursChange(value);
    setHoursError(error);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, error } = validateTimeInput(e.target.value, false);
    onMinutesChange(value);
    setMinutesError(error);
  };

  const handleBlur = () => {
    setHoursError(undefined);
    setMinutesError(undefined);
    onBlur?.();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
          <FontAwesomeIcon 
            icon={faClock} 
            className="text-green-400/75"
          />
        </div>
        <div className={`
          flex items-center w-full pl-12 pr-4 py-3 
          border rounded-xl transition-all duration-200
          ${hoursError || minutesError ? 'border-red-500/50' : 'border-stone-700/50'}
          focus-within:ring-2 focus-within:ring-green-500/30
          focus-within:border-green-500/30
          ${className}
          ${textSize}
        `}>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              value={hours}
              onChange={handleHoursChange}
              onBlur={handleBlur}
              aria-invalid={!!hoursError}
              aria-errormessage={hoursError ? "hours-error" : undefined}
              style={{ width: `${Math.max(1, hours.length)}ch` }}
              className="bg-transparent text-right outline-none font-mono
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="text-gray-400 ml-0.5">h</span>
          </div>
          <div className="flex items-center ml-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              value={minutes}
              onChange={handleMinutesChange}
              onBlur={handleBlur}
              aria-invalid={!!minutesError}
              aria-errormessage={minutesError ? "minutes-error" : undefined}
              style={{ width: `${Math.max(1, minutes.length)}ch` }}
              className="bg-transparent text-right outline-none font-mono
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="text-gray-400 ml-0.5">m</span>
          </div>
        </div>
      </div>
      {(hoursError || minutesError) && (
        <div className="text-sm text-red-400 px-4">
          {hoursError && <span id="hours-error">{hoursError}</span>}
          {minutesError && <span id="minutes-error">{minutesError}</span>}
        </div>
      )}
    </div>
  );
};

export { validateTimeInput };
export default DurationPickerBase; 