import React, { Suspense, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import Header from "../components/layout/header";
import { useCalendar } from "../api/calendar";
import { DateTime, Duration } from "luxon";
import { MonthCalendar, WeekCalendar } from "../components/organisms/calendar";
import { Button } from "../components/atoms/button";
import { Select } from "../components/atoms/select";
import { queryToSearchString, useQuery } from "../utils/router";
import { date, defaulted, Infer, optional, type } from "superstruct";
import { IsoDate, LuxonDateTime, StepSchema } from "../api/schema";
import { current, next, previous } from "../utils/date";

const QuerySchema = type({
  date: defaulted(LuxonDateTime, DateTime.now()),
  step: defaulted(StepSchema, "month"),
});

type Query = Infer<typeof QuerySchema>;

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

type Action = { type: "setSelectedStep"; payload: Step };

const steps: Step[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

interface CalendarHeader {
  query: Query;
  navigate: (newQuery: Query) => void;
}

const CalendarHeader = ({ query, navigate }: CalendarHeader) => {
  return (
    <div
      pos="sticky top-0"
      bg="dark-800"
      z="10"
      display="flex"
      flex="col"
      justify="items-stretch"
      w="full"
      text="gray-300"
      >
      <div
        z="10"
        display="grid"
        grid="cols-[auto_1fr_auto] rows-1 gap-8"
        align="items-center"
        justify="start"
        w="full"
        p="y-8"
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
        <h1 text="green-300 2xl">
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
      {query.step === "week" && <div w="min-3xl" bg="dark-800" display="grid" grid="cols-[4rem_auto_auto_auto_auto_auto_auto_auto] col-span-7">
        <div></div>
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} text="center" p="b-2">
            {day}
          </div>
        ))}
      </div>}

      {query.step === "month" && <div w="min-3xl" bg="dark-800" display="grid" grid="cols-7 col-span-7">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} text="center" p="b-2">
            {day}
          </div>
        ))}
      </div>}
      
    </div>
  );
};

interface CalendarInner {
  auth0: Auth0ContextInterface<User>;
  query: Query;
}

const CalendarInner = ({ auth0, query }: CalendarInner) => {
  const { data, error, mutate } = useCalendar({
    auth0,
    params: {
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

  return (
    <>
      {query.step === "month" && (
        <MonthCalendar date={query.date} dates={data.body} />
      )}
      {query.step === "week" && (
        <WeekCalendar date={query.date} dates={data.body} />
      )}
    </>
  );
};

const Calendar = () => {
  const auth0 = useAuth0();
  const { push, location } = useHistory();
  const query = useQuery(QuerySchema);

  const navigate = (query: Query) => {
    push({
      ...location,
      search: queryToSearchString(query, SearchSchema),
    });
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
      h="screen max-screen"
      w="full"
      p="x-6"
    >
      <div
        display="flex"
        flex="col grow"
        align="items-center"
        w="full max-screen-7xl"
        h="screen max-screen"
      >
        <CalendarHeader query={query} navigate={navigate} />
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
