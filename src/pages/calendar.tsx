import React, { Suspense, useReducer } from "react";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import Header from "../components/layout/header";
import { useCalendar } from "../api/calendar";
import { DateTime, Duration } from "luxon";
import { MonthCalendar } from "../components/organisms/calendar";
import { Button } from "../components/atoms/button";
import { Select } from "../components/atoms/select";
import { queryToSearchString, useQuery } from "../utils/router";
import { date, defaulted, optional, type } from "superstruct";
import { IsoDate, LuxonDateTime, StepsSchema } from "../api/schema";
import { useHistory } from "react-router-dom";

const QuerySchema = type({
  date: defaulted(LuxonDateTime, DateTime.now()),
  step: defaulted(StepsSchema, "month"),
});

const SearchSchema = type({
  date: IsoDate,
  step: StepsSchema
})

interface CalendarInner {
  auth0: Auth0ContextInterface<User>;
}

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

const CalendarInner = ({ auth0 }: CalendarInner) => {
  const { push, location } = useHistory();
  const query = useQuery(QuerySchema);

  const initialState: CalendarState = {
    date: query.date.startOf(query.step),
    steps: steps,
    selectedStep: steps.find((s) => s.id === query.step) ?? steps[0],
  };

  const [state, dispatch] = useReducer(
    (state: CalendarState, action: Action): CalendarState => {
      switch (action.type) {
        case "setSelectedStep":
          return { ...state, selectedStep: action.payload };
        default:
          return state;
      }
    },
    initialState
  );

  const { data, error } = useCalendar({
    auth0,
    params: {
      date: query.date,
      step: query.step,
    },
    swrOpts: {}
  });

  if (error || data?.status !== 200) {
    return <div>Error</div>;
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
        <div display="flex" flex="row" justify="between" w="full" p="y-4">
          <div display="grid" grid="gap-2 cols-[auto_auto_auto]">
            <Button
              onClick={() =>
                push({
                  ...location,
                  search: queryToSearchString({
                    ...query,
                    date: DateTime.now(),
                  }, SearchSchema),
                })
              }
            >
              Today
            </Button>
            <Button onClick={() => {
              push({
                ...location,
                search: queryToSearchString({
                  ...query,
                  date: state.date.set({month: state.date.month - 1}),
                }, SearchSchema),
              })
            }}>
              <span className="icon-chevron-left"></span>
            </Button>
            <Button onClick={() => {
              push({
                ...location,
                search: queryToSearchString({
                  ...query,
                  date: state.date.set({month: state.date.month + 1}),
                }, SearchSchema),
              })
            }}>
              <span className="icon-chevron-right"></span>
            </Button>
          </div>
          <Select
            values={state.steps}
            selected={state.selectedStep}
            setSelected={(s) =>
              dispatch({ type: "setSelectedStep", payload: s })
            }
          />
        </div>
        {state.selectedStep.id === "month" && (
          <MonthCalendar dates={data.body} />
        )}
      </div>
    </div>
  );
};

const Calendar = () => {
  const auth0 = useAuth0();

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
    <Suspense
      fallback={
        <div className="flex flex-col items-center text-green-300 text-4xl">
          <div className="icon-alarm icon-lg mb-4 animate-spin animate-duration-3000"></div>
          <div>Loading</div>
        </div>
      }
    >
      <CalendarInner auth0={auth0} />
    </Suspense>
  );
};

export default Calendar;
