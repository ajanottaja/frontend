import { DateTime } from "luxon";
import React from "react";
import { CalendarDate } from "../../api/calendar";
import { daysOfMonth, daysOfWeek } from "../../utils/date";

interface Calendar {
  dates?: CalendarDate[];
  date: DateTime;
}

export const WeekCalendar = ({ dates, date }: Calendar) => {
  const fallbackDates = daysOfWeek(date);

  return (
    <div display="flex" flex="col" justify="items-end" w="full" overflow="y-auto">
      <div
        w="min-full full"
        display="grid"
        justify="items-stretch"
        grid="gap-1 cols-[4rem_auto_auto_auto_auto_auto_auto_auto]"
        text="gray-400"
      >
        <div display="grid" grid="rows-24 gap-1">
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].map((hour) => {
            return (
              <div
                display="flex"
                justify="center"
                bg="dark-500"
                text="gray-600"
                h="full"
                w="full"
              >
                <span>
                  {DateTime.fromObject({ hour, minute: 0, second: 0 }).toFormat(
                    "HH:mm"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        {dates &&
          dates.map(({ date, target, intervals }, i) => (
            <div display="grid" grid="rows-24 gap-1" h="[720px]" pos="relative">
              {intervals.map((interval) => {
                const minutesPastMidnight =
                  interval.interval.beginning
                    .diff(interval.interval.beginning.startOf("day"))
                    .as("minutes") / 2;
                const length =
                  (interval.interval.end ?? DateTime.now())
                    .diff(interval.interval.beginning)
                    .as("minutes") / 2;
                return (
                  <div
                    pos="absolute"
                    w="full"
                    p="x-2"
                    style={{
                      top: minutesPastMidnight,
                    }}
                  >
                    <div
                      key={interval.interval.beginning.toISODate()}
                      bg="green-900"
                      border="rounded"
                      text="xs gray-300 center"
                      p="1"
                      m="b-1"
                      w="full min-full"
                      h="min-6"
                      style={{
                        height: `${length}px`,
                      }}
                    >
                      {interval.interval.beginning.toFormat("HH:mm")} -{" "}
                      {interval.interval.end?.toFormat("HH:mm")}
                    </div>
                  </div>
                );
              })}
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
              ].map((hour) => {
                return <div bg="dark-500" h="full"></div>;
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export const MonthCalendar = ({ dates, date }: Calendar) => {
  // While loading, display skeleton for number of dates
  const fallbackDates = daysOfMonth(date);

  return (
    <div
      w="full"
      flex="grow"
      display="grid"
      grid="gap-1 md:cols-7"
      text="gray-400"
      className="grid-auto-fit"
    >
      {dates &&
        dates.map(({ date, target, intervals }, i) => (
          <div
            key={date.toISODate()}
            display="flex"
            bg="dark-500"
            flex="col"
            h="min-28"
            w="min-24"
            p="1"
            className={
              i !== 0 ? "" : `<md:col-start-1 col-start-${date.weekday}`
            }
          >
            <div display="flex" flex="row" justify="between" p="b-2">
              <span text="gray-500">{date.day}</span>
              {target && <span text="sm">{target.duration.toFormat("hh:mm")}</span>}
            </div>

            {intervals.map((interval) => (
              <div
                key={interval.interval.beginning.toISODate()}
                bg="green-900"
                border="rounded"
                text="xs gray-300 center"
                p="1"
                m="b-1"
              >
                {interval.interval.beginning.toFormat("HH:mm")} -{" "}
                {interval.interval.end?.toFormat("HH:mm")}
              </div>
            ))}
          </div>
        ))}

      {!dates &&
        fallbackDates.map((date, i) => (
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
  );
};
