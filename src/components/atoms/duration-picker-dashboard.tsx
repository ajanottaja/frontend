import { Duration } from "luxon";
import React, { useState } from "react";
import { IconButton } from "./button";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "./modal";
import DurationPickerBase, { validateTimeInput } from "./duration-picker-base";

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
  const [hours, setHours] = useState(() => (duration?.hours ?? 0).toString());
  const [minutes, setMinutes] = useState(() => (duration?.minutes ?? 0).toString());
  const [hasError, setHasError] = useState(false);

  const handleSubmit = () => {
    const h = Math.min(parseInt(hours) || 0, 24);
    const m = Math.min(parseInt(minutes) || 0, 59);
    const newDuration = Duration.fromObject({ hours: h, minutes: m });
    setDuration(newDuration);
    close();
  };

  const handleHoursChange = (value: string) => {
    const { error } = validateTimeInput(value, true);
    setHours(value);
    setHasError(!!error);
  };

  const handleMinutesChange = (value: string) => {
    const { error } = validateTimeInput(value, false);
    setMinutes(value);
    setHasError(!!error);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={title ?? "Duration"}>
      <div className="space-y-6">
        <DurationPickerBase
          hours={hours}
          minutes={minutes}
          onHoursChange={handleHoursChange}
          onMinutesChange={handleMinutesChange}
          className="bg-stone-900/75 text-gray-200"
          textSize="text-2xl"
        />

        <div className="flex gap-3">
          <IconButton
            icon={faCheck}
            ariaLabel="Save target"
            onClick={handleSubmit}
            disabled={hasError}
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
