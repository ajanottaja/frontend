import { Duration } from "luxon";
import React, { useState } from "react";
import { IconButton } from "./button";
import { faCheck, faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "./modal";

interface DurationPicker {
  duration?: Duration;
  setDuration: (duration: Duration) => void;
  title?: string;
  isOpen: boolean;
  close: () => void;
}

const DurationPickerDashboard = ({
  duration,
  setDuration,
  title,
  isOpen,
  close,
}: DurationPicker) => {
  // Convert duration to HH:mm format for the time input
  const [timeValue, setTimeValue] = useState(() => {
    const hours = duration?.hours ?? 0;
    const minutes = duration?.minutes ?? 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  const handleSubmit = () => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDuration = Duration.fromObject({ hours, minutes });
    setDuration(newDuration);
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={title ?? "Duration"}>
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon 
              icon={faClock} 
              className="text-green-400/75 text-xl"
            />
          </div>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-900/75 border border-stone-700/50 rounded-xl text-2xl text-center text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all duration-200
              placeholder:text-gray-500
              [&::-webkit-calendar-picker-indicator]:bg-none
              [&::-webkit-calendar-picker-indicator]:hidden
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-clear-button]:hidden"
          />
        </div>

        <div className="flex gap-3">
          <IconButton
            icon={faCheck}
            ariaLabel="Save target"
            onClick={handleSubmit}
            className="flex-1 hover:from-green-500 hover:to-teal-500 
              text-white border-none transition-all duration-200"
          >
            Save
          </IconButton>
          <IconButton
            icon={faTimes}
            ariaLabel="Cancel"
            onClick={close}
            className="flex-1 bg-stone-800 hover:bg-stone-700 text-gray-300 
              border-none transition-all duration-200"
          >
            Cancel
          </IconButton>
        </div>
      </div>
    </Modal>
  );
};

export default DurationPickerDashboard;
