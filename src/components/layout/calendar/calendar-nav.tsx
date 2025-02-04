import React from "react";
import { CalendarQuery } from "../../../schema/calendar";
import { current, next, previous } from "../../../utils/date";
import { Button, IconButton } from "../../atoms/button";
import { Select } from "../../atoms/select";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
    <div className="flex flex-col space-y-4 w-full max-w-7xl mx-auto">
      {/* Navigation Controls - Single line on mobile */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            icon={faCalendar}
            ariaLabel={query.startDate.toFormat("DDDD")}
            onClick={() =>
              navigate({
                ...query,
                startDate: current(query.duration),
              })
            }
          >
            Today
          </IconButton>
          <div className="flex gap-1">
            <IconButton
              size="small"
              icon={faChevronLeft}
              ariaLabel={`Previous ${query.duration}`}
              onClick={() => {
                navigate({
                  ...query,
                  startDate: previous(query.duration, query.startDate),
                });
              }}
            />
            <IconButton
              size="small"
              icon={faChevronRight}
              ariaLabel={`Next ${query.duration}`}
              onClick={() => {
                navigate({
                  ...query,
                  startDate: next(query.duration, query.startDate),
                });
              }}
            />
          </div>
        </div>

        {/* Desktop Time Display */}
        <div className="hidden md:block text-center md:w-2/4">
          <h1 className="text-2xl font-medium text-gray-200">
            {query.duration === "month" && (
              <>
                {query.startDate.monthLong} {query.startDate.year}
              </>
            )}
            {query.duration === "week" && (
              <>
                Week {query.startDate.weekNumber}, {query.startDate.year}
              </>
            )}
            {query.duration === "day" && (
              <>
                {query.startDate.toFormat("MMMM d, yyyy")}
              </>
            )}
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex justify-end">
          <Select
            size="small"
            className="min-w-32"
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
      </div>

      {/* Mobile Time Display */}
      <div className="md:hidden text-center pb-4">
        <h1 className="text-xl font-medium text-gray-200">
          {query.duration === "month" && (
            <>
              {query.startDate.monthLong} {query.startDate.year}
            </>
          )}
          {query.duration === "week" && (
            <>
              Week {query.startDate.weekNumber}, {query.startDate.year}
            </>
          )}
          {query.duration === "day" && (
            <>
              {query.startDate.toFormat("MMMM d, yyyy")}
            </>
          )}
        </h1>
      </div>
    </div>
  );
};

export default CalendarNav;
