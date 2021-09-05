import { DateTime } from "luxon";
import React from "react";
import { CalendarDate } from "../../api/calendar";
import { daysOfMonth } from "../../utils/date";

interface MonthCalendar {
  dates?: CalendarDate[];
  date: DateTime;
}

export const MonthCalendar = ({dates, date}: MonthCalendar) => {
  // While loading, display skeleton for number of dates
  const fallbackDates = daysOfMonth(date);

  return <div
  w="full"
  display="grid"
  grid="gap-1 md:cols-7"
  text="gray-400"
  className="grid-auto-fit"
>
  {/* repeat(auto-fit, minmax(100px, 1fr)); */}
  <div grid="col-span-full md:col-span-7" text="center green-300" p="b-4">
    <h1 text="4xl">{date.monthLong} {date.year}</h1>
  </div>

  {[
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].map((day) => (
    <div key={day} display="<md:hidden" text="center" p="b-4">
      {day}
    </div>
  ))}

  {dates && dates.map(({ date, target, intervals }, i) => (
    <div
      key={date.toISODate()}
      display="flex"
      bg="dark-500"
      flex="col"
      h="min-32"
      w="min-24"
      p="1"
      className={
        i !== 0 ? "" : `<md:col-start-1 col-start-${date.weekday}`
      }
    >
      <div display="flex" flex="row" justify="between" p="b-2">
        <span text="gray-500">{date.day}</span>
        {target && <span text="sm">{target.toFormat("hh:mm")}</span>}
      </div>

      {intervals.map((interval) => (
        <div
          key={interval.beginning.toISODate()}
          bg="green-900"
          border="rounded"
          text="xs gray-300 center"
          p="1"
          m="b-1"
        >
          {interval.beginning.toFormat("HH:mm")} -{" "}
          {interval.end?.toFormat("HH:MM")}
        </div>
      ))}
    </div>
  ))}

  {!dates && fallbackDates.map((date, i) => (
    <div
    key={date.toISODate()}
    display="flex"
    bg="dark-500"
    flex="col"
    h="min-32"
    w="min-24"
    p="1"
    animate="pulse"
    className={
      i !== 0 ? "" : `<md:col-start-1 col-start-${date.weekday}`
    }
  >
    <div display="flex" flex="row" justify="between" p="b-2">
      <span text="gray-500">{date.day}</span>
    </div>

  </div>
  ))}

</div>
}