import React, { Suspense, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime, Duration } from "luxon";
import { MonthCalendar, WeekCalendar, DayCalendar } from "../components/organisms/calendar";
import { queryParamsToSearchString, useQueryParams } from "../utils/router";
import CalendarNav from "../components/layout/calendar/calendar-nav";
import { MonthHeader, WeekHeader } from "../components/layout/calendar/headers";
import { useClient } from "../supabase/use-client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  calendarDateSchema,
  CalendarParams,
  calendarParamsSchema,
  CalendarQuery,
  calendarQuerySchema,
  calendarDurationSchema,
  CalendarDuration,
} from "../schema/calendar";
import { dateTimeToIso8601Date, durationToIso8601 } from "../schema/custom";

const transformDuration = (duration: CalendarDuration) => {
  switch (duration) {
    case "week":
      return Duration.fromObject({ weeks: 1 });
    case "month":
      return Duration.fromObject({ months: 1 });
    default:
      return Duration.fromObject({ days: 1 });
  }
};

const calendarParams = z
  .object({
    startDate: dateTimeToIso8601Date,
    step: z.string().default("1 day"),
    duration: calendarDurationSchema.transform(transformDuration),
  })
  .transform(({ startDate, duration, step }) => ({
    date_start: startDate,
    duration,
    step,
  }));

const useCalendar = (query: CalendarQuery) => {
  const client = useClient();
  const params = calendarParams.parse(query);
  // Call supabase rpc calendar function to get calendar rows
  return useQuery({
    queryKey: ["calendar", params],
    queryFn: async () => {
      const { data, error } = await client
        .rpc("calendar", params)
        .select("date,target::json,tracks");
      if (error) throw error;
      return z.array(calendarDateSchema).parse(data);
    },
  });
};

interface CalendarInner {
  query: CalendarQuery;
}

const CalendarInner = ({ query }: CalendarInner) => {
  const { data, error, refetch } = useCalendar(query);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      {query.duration === "month" && (
        <MonthCalendar date={query.startDate} dates={data} />
      )}
      {query.duration === "week" && (
        <WeekCalendar date={query.startDate} dates={data} />
      )}
      {query.duration === "day" && (
        <DayCalendar date={query.startDate} dates={data} />
      )}
    </>
  );
};

/**
 * Page component to render the calendar.
 * Handles navigation and pagination and leaves data fetching to inner calendar component.
 * This allows us to use React suspense to show loading indicator for calendar data.
 */
const Calendar = () => {
  const navigate = useNavigate();
  const query = useQueryParams(calendarQuerySchema);

  const navigateCalendar = (query: CalendarQuery) => {
    navigate(
      `${location.pathname}?${queryParamsToSearchString(
        query,
        calendarParamsSchema
      )}`
    );
  };

  return (
    <div
      display="flex"
      flex="col"
      align="content-center items-center"
      justify="start"
      h="min-content"
      w="full"
      p="x-6"
    >
      <div
        display="flex"
        flex="col grow"
        align="items-center"
        w="full max-screen-7xl"
        h="min-content"
      >
        <div
          pos="sticky top-0"
          bg="dark-800"
          z="10"
          display="flex"
          flex="col"
          justify="items-stretch"
          w="full"
          text="gray-300"
          p="t-4"
        >
          <CalendarNav query={query} navigate={navigateCalendar} />
          {query.duration === "week" && <WeekHeader />}
          {query.duration === "month" && <MonthHeader />}
        </div>

        <Suspense
          fallback={
            <>
              {query.duration === "month" && (
                <MonthCalendar date={query.startDate} />
              )}
            </>
          }
        >
          <CalendarInner query={query} />
        </Suspense>
      </div>
    </div>
  );
};

export default Calendar;
