import { Duration } from "luxon";
import React, { useState } from "react";
import DurationPickerBase from "./duration-picker-base";

interface DurationPicker {
  duration?: Duration;
  setDuration: (duration: Duration) => void;
}

const DurationPicker = ({ duration, setDuration }: DurationPicker) => {
  const [hours, setHours] = useState(() => duration?.hours?.toString() ?? "0");
  const [minutes, setMinutes] = useState(() => duration?.minutes?.toString() ?? "0");

  const handleBlur = () => {
    const h = Math.min(parseInt(hours) || 0, 24);
    const m = Math.min(parseInt(minutes) || 0, 59);
    setHours(h.toString());
    setMinutes(m.toString());
    setDuration(Duration.fromObject({ hours: h, minutes: m }));
  };

  return (
    <DurationPickerBase
      hours={hours}
      minutes={minutes}
      onHoursChange={setHours}
      onMinutesChange={setMinutes}
      onBlur={handleBlur}
      className="bg-stone-800/75 text-gray-300 hover:bg-stone-800"
    />
  );
};

export default DurationPicker;
