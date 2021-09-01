import React, { useEffect, useState, Suspense } from "react";
import {
  Auth0ContextInterface,
  useAuth0,
  User,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import Header from "../components/layout/header";
import { useCalendar } from "../api/calendar";
import { DateTime } from "luxon";
import { map } from "superstruct";


interface CalendarInner {
  auth0: Auth0ContextInterface<User>;
}

const CalendarInner = ({ auth0 }: CalendarInner) => {
  
  const [] = useState<DateTime>();
  const { data, error } = useCalendar({auth0, params: {date: DateTime.fromObject({year: 2021, month: 8, day: 1}), step: "month"}});

  if(error || data?.status !== 200) {
    return <div>Error</div>
  }

  return (
    <div
      display="flex"
      flex="col"
      align="content-center"
      justify="start"
      h="full min-screen"
    >
      <Header />
      <div display="flex" flex="col grow" justify="content-center">
        <div
          w="max-full"
          justify="self-center items-center"
          align="self-center items-self-stretch"
          display="flex"
          p="<lg:x-4"
        >
          <div
            w="screen-xl"
            m="x-8"
            display="grid"
            grid="cols-7 <lg:auto-cols-fr gap-1"
            
            text="gray-400"
          >
            {/* repeat(auto-fit, minmax(100px, 1fr)); */}
            <div grid="col-span-7 <lg:col-auto" text="center green-300" p="b-4">
              <h1 text="4xl">August</h1>
            </div>

            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day =>
              <div display="<lg:hidden" text="center" m="x-2 b-4">
                {day}
              </div>
            )}

            {data?.body.map(({date, target, intervals}, i) =>
              <div display="flex" flex="col" h="min-32" w="min-32" p="2" bg="dark-500" className={i !== 0 ? "" : `col-start-${date.weekday} <lg:col-start-1`}>
                <div display="flex" flex="row" justify="between" p="b-2">
                  <span text="gray-500">{date.day}</span>
                  {target && <button>{target.toFormat("hh:mm")}</button>}
                </div>
                
                {intervals.map(interval => <div bg="green-900" text="xs gray-300" p="1">
                  {interval.beginning.toFormat("HH:mm")} - {interval.end?.toFormat("HH:MM")}
                </div>)}
              </div>)
            }
            
          </div>
        </div>
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
