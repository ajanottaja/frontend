import React from "react";
import { CalendarQuery } from "../../../schema/calendar";
import { current, next, previous } from "../../../utils/date";
import { Button } from "../../atoms/button";
import { Select } from "../../atoms/select";

interface Step {
  id: "day" | "week" | "month";
  label: "Day" | "Week" | "Month";
  selected?: boolean;
  disabled?: boolean;
}

const steps: Step[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

interface CalendarNav {
  query: CalendarQuery;
  navigate: (newQuery: CalendarQuery) => void;
}

const CalendarNav = ({ query, navigate }: CalendarNav) => {
  return (
    <div
      z="10"
      display="grid"
      grid="cols-[auto_1fr_auto] <sm:cols-2 <sm:rows-2 rows-1 gap-x-8 gap-y-2"
      align="items-center"
      justify="start"
      w="full"
      p="b-8 <sm:b-4"
    >
      <div display="grid" grid="gap-2 cols-[1fr_auto_auto]" w="max-64">
        <Button
          title={query.startDate.toFormat("DDDD")}
          onClick={() =>
            navigate({
              ...query,
              startDate: current(query.duration),
            })
          }
        >
          Today
        </Button>
        <Button
          title={`Previous ${query.duration}`}
          onClick={() => {
            navigate({
              ...query,
              startDate: previous(query.duration, query.startDate),
            });
          }}
        >
          <span className="icon-chevron-left"></span>
        </Button>
        <Button
          title={`Next ${query.duration}`}
          onClick={() => {
            navigate({
              ...query,
              startDate: next(query.duration, query.startDate),
            });
          }}
        >
          <span className="icon-chevron-right"></span>
        </Button>
      </div>
      <h1 text="green-300 2xl <sm:lg" grid="<sm:row-start-2 <sm:col-span-2">
        {query.duration === "month" && (
          <>
            {" "}
            {query.startDate.monthLong} {query.startDate.year}
          </>
        )}
        {query.duration === "week" && (
          <>
            {" "}
            Week {query.startDate.weekNumber} {query.startDate.year}
          </>
        )}
      </h1>
      <Select
        justify="self-end"
        values={steps}
        selected={steps.find((s) => s.id === query.duration) ?? steps[0]}
        setSelected={(s) => {
          navigate({
            ...query,
            duration: s.id,
          });
        }}
      />
    </div>
  );
};

export default CalendarNav;
