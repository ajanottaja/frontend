import { DateTime } from "luxon";
import React from "react";
import { daysOfWeek } from "../../../utils/date";

export const WeekHeader = () => {
  const weekDays = daysOfWeek(DateTime.now());
  return (
    <div
      w="min-full full"
      bg="dark-800"
      display="grid"
      grid="cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] col-span-7"
    >
      <div></div>
      {weekDays.map((day) => (
        <div key={day.weekdayShort} text="center" p="b-2">
          <span display="<md:hidden">{day.weekdayLong}</span>
          <span display="<sm:hidden md:hidden">{day.weekdayShort}</span>
          <span display="sm:hidden" text="xs">
            {day.toFormat("EEEEE")}
          </span>
        </div>
      ))}
    </div>
  );
};

export const MonthHeader = () => {
  return (
    <div
      w="min-3xl"
      bg="dark-800"
      display="grid <md:hidden"
      grid="cols-7 col-span-7"
    >
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => (
        <div key={day} text="center gray-300" p="b-2">
          {day}
        </div>
      ))}
    </div>
  );
};
