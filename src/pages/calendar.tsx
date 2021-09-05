import React, { Suspense, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import Header from "../components/layout/header";
import { useCalendar } from "../api/calendar";
import { DateTime, Duration } from "luxon";
import { MonthCalendar } from "../components/organisms/calendar";
import { Button } from "../components/atoms/button";
import { Select } from "../components/atoms/select";
import { queryToSearchString, useQuery } from "../utils/router";
import { date, defaulted, Infer, optional, type } from "superstruct";
import { IsoDate, LuxonDateTime, StepsSchema } from "../api/schema";

const QuerySchema = type({
  date: defaulted(LuxonDateTime, DateTime.now()),
  step: defaulted(StepsSchema, "month"),
});

type Query = Infer<typeof QuerySchema>;

const SearchSchema = type({
  date: IsoDate,
  step: StepsSchema,
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
    <div display="flex" flex="row" justify="between" w="full" p="y-4">
      <div display="grid" grid="gap-2 cols-[auto_auto_auto]">
        <Button
          onClick={() =>
            navigate({
              ...query,
              date: DateTime.now(),
            })
          }
        >
          Today
        </Button>
        <Button
          onClick={() => {
            navigate({
              ...query,
              date: query.date.set({ month: query.date.month - 1 }),
            });
          }}
        >
          <span className="icon-chevron-left"></span>
        </Button>
        <Button
          onClick={() => {
            navigate({
              ...query,
              date: query.date.set({ month: query.date.month + 1 }),
            });
          }}
        >
          <span className="icon-chevron-right"></span>
        </Button>
      </div>
      <Select
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

  return <>{query.step === "month" && <MonthCalendar date={query.date} dates={data.body} />}</>;
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
  }

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
      h="full min-screen"
    >
      <Header />
      <div
        display="flex"
        flex="col grow"
        align="items-center"
        w="full max-screen-7xl"
        p="x-2"
      >
        <CalendarHeader query={query} navigate={navigate} />
        <Suspense
          fallback={<>
            {query.step === "month" && <MonthCalendar date={query.date} />}
          </>}
        >
          <CalendarInner auth0={auth0} query={query} />
        </Suspense>
      </div>
    </div>
  );
};

export default Calendar;
