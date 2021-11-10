import React, { Suspense, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import { useCalendar } from "../api/calendar";
import { DateTime, Duration } from "luxon";
import { MonthCalendar, WeekCalendar } from "../components/organisms/calendar";
import { Button } from "../components/atoms/button";
import { Select } from "../components/atoms/select";
import { queryToSearchString, useQuery } from "../utils/router";
import { date, defaulted, Infer, optional, type } from "superstruct";
import { IsoDate, LuxonDateTime, StepSchema } from "../api/schema";
import { current, daysOfWeek, next, previous } from "../utils/date";
import { SwrMutateProvider } from "../components/providers/swr-mutation-provider";
import { Query, QuerySchema } from "../schema/calendar";
import CalendarNav from "../components/layout/calendar/calendar-nav";
import { MonthHeader, WeekHeader } from "../components/layout/calendar/headers";

const SearchSchema = type({
  date: IsoDate,
  step: StepSchema,
});

interface Step {
  id: "day" | "week" | "month";
  label: "Day" | "Week" | "Month";
  selected?: boolean;
  disabled?: boolean;
}

interface CalendarState {
  date: DateTime;
  steps: Step[];
  selectedStep: Step;
}

const steps: Step[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

interface CalendarHeader {
  query: Query;
  navigate: (newQuery: Query) => void;
}

interface CalendarInner {
  auth0: Auth0ContextInterface<User>;
  query: Query;
}

const CalendarInner = ({ auth0, query }: CalendarInner) => {
  const { data, error, mutate } = useCalendar({
    auth0,
    query: {
      date: query.date.startOf(query.step),
      step: query.step,
    },
    swrOpts: {
      revalidateOnMount: false,
    },
  });

  if (error || data?.status !== 200) {
    return <div>Error</div>;
  }

  const provider = { mutate };

  return (
    <SwrMutateProvider value={provider}>
      {query.step === "month" && (
        <MonthCalendar date={query.date} dates={data.body} />
      )}
      {query.step === "week" && (
        <WeekCalendar date={query.date} dates={data.body} />
      )}
    </SwrMutateProvider>
  );
};

const Calendar = () => {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const query = useQuery(QuerySchema);

  const navigateCalendar = (query: Query) => {
    navigate(
      `${location.pathname}?${queryToSearchString(query, SearchSchema)}`
    );
    // push({
    //   ...location,
    //   search: queryToSearchString(query, SearchSchema),
    // });
  };

  if (auth0.isLoading) {
    return <div>Is loading</div>;
  }

  if (auth0.error) {
    return <div>Authentication error</div>;
  }

  if (!auth0.isAuthenticated) {
    return <div>Not authenticated</div>;
  }

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
          {query.step === "week" && <WeekHeader />}
          {query.step === "month" && <MonthHeader />}
        </div>

        <Suspense
          fallback={
            <>{query.step === "month" && <MonthCalendar date={query.date} />}</>
          }
        >
          <CalendarInner auth0={auth0} query={query} />
        </Suspense>
      </div>
    </div>
  );
};

export default Calendar;
