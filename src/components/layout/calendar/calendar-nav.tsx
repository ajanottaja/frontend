import React from "react";
import { Query } from "../../../schema/calendar";
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
  query: Query;
  navigate: (newQuery: Query) => void;
}

const CalendarNav = ({query, navigate}: CalendarNav) => {
  return <div
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
      title={query.date.toFormat("DDDD")}
      onClick={() =>
        navigate({
          ...query,
          date: current(query.step),
        })
      }
    >
      Today
    </Button>
    <Button
      title={`Previous ${query.step}`}
      onClick={() => {
        navigate({
          ...query,
          date: previous(query.step, query.date),
        });
      }}
    >
      <span className="icon-chevron-left"></span>
    </Button>
    <Button
      title={`Next ${query.step}`}
      onClick={() => {
        navigate({
          ...query,
          date: next(query.step, query.date),
        });
      }}
    >
      <span className="icon-chevron-right"></span>
    </Button>
  </div>
  <h1 text="green-300 2xl <sm:lg" grid="<sm:row-start-2 <sm:col-span-2">
    {query.step === "month" && (
      <>
        {" "}
        {query.date.monthLong} {query.date.year}
      </>
    )}
    {query.step === "week" && (
      <>
        {" "}
        Week {query.date.weekNumber} {query.date.year}
      </>
    )}
  </h1>
  <Select
    justify="self-end"
    values={steps}
    selected={steps.find((s) => s.id === query.step) ?? steps[0]}
    setSelected={(s) => {
      navigate({
        ...query,
        step: s.id,
      });
    }}
  />
</div>
}

export default CalendarNav;