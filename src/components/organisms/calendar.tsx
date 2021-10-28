import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { DateTime } from "luxon";
import React, { Fragment, useState } from "react";
import { CalendarDate, IntervalRecord, TargetRecord } from "../../api/calendar";
import { daysOfMonth, daysOfWeek } from "../../utils/date";
import { IntervalEditor } from "./interval-editor";
import { TargetEditor } from "./target-editor";

interface Calendar {
  dates?: CalendarDate[];
  date: DateTime;
  auth0: Auth0ContextInterface<User>;
}

const WeekTarget = ({
  target,
  auth0,
}: {
  target: TargetRecord;
  auth0: Auth0ContextInterface<User>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <button
      key={target.id}
      role="button"
      border="rounded"
      text="xs gray-300 center"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      <span display="<md:hidden">{target.duration.toFormat("hh:mm")}</span>
      <span display="md:hidden">{target.duration.toFormat("hh")}</span>
      <TargetEditor
        auth0={auth0}
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};


const WeekInterval = ({
  interval,
  auth0,
}: {
  interval: IntervalRecord;
  auth0: Auth0ContextInterface<User>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const minutesPastMidnight =
    interval.interval.beginning
      .diff(interval.interval.beginning.startOf("day"))
      .as("minutes");
  const length =
    (interval.interval.end ?? DateTime.now())
      .diff(interval.interval.beginning)
      .as("minutes");
  return (
    <div
      pos="absolute"
      w="full"
      p="x-2"
      style={{
        top: minutesPastMidnight,
      }}
      onClick={() => setIsEditing(true)}
    >
      <button
        key={interval.interval.beginning.toISODate()}
        display="flex"
        align="items-start"
        bg="green-900 focus:green-800"
        focus="outline-transparent"
        ring="1 transparent :focus:green-400"
        border="rounded"
        text="xs gray-300 focus:gray-200"
        p="1"
        m="b-1"
        w="full min-full"
        h="min-6"
        style={{
          height: `${length}px`,
        }}
      >
       <span display="<md:hidden">
       {interval.interval.beginning.toFormat("HH:mm")} -{" "}
        {interval.interval.end.isValid
          ? interval.interval.end.toFormat("HH:mm")
          : "now"}
       </span>
        <IntervalEditor
          auth0={auth0}
          interval={interval}
          isOpen={isEditing}
          close={() => setIsEditing(false)}
        />
      </button>
    </div>
  );
};

export const WeekCalendar = ({ dates, date, auth0 }: Calendar) => {
  const fallbackDates = daysOfWeek(date);
  return (
    <div
      display="flex"
      flex="col"
      justify="items-end"
      w="full"
      overflow="y-auto"
    >
      <div
        p="b-4"
        w="min-full full"
        display="grid"
        justify="items-stretch"
        grid="gap-1 cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
        text="gray-400"
      >
        <div text="center" display="<md:hidden">Target</div>
        <div text="center" display="md:hidden"><FontAwesomeIcon icon={faBullseye} /></div>
        {dates &&
          dates.map(({ target }) =>
            target ? <WeekTarget auth0={auth0} target={target} /> : <div />
          )}
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
                    "HH"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        {dates &&
          dates.map(({ date, target, intervals }, i) => (
            <div display="grid" grid="rows-24 gap-1" h="[1440px]" pos="relative">
              {intervals.map((interval) => (
                <WeekInterval auth0={auth0} interval={interval} />
              ))}
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

const MonthTarget = ({
  target,
  auth0,
}: {
  target: TargetRecord;
  auth0: Auth0ContextInterface<User>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <button
      key={target.id}
      role="button"
      border="rounded"
      text="xs gray-300 right"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      {target.duration.toFormat("hh:mm")}
      <TargetEditor
        auth0={auth0}
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};


const MonthInterval = ({
  interval,
  auth0,
}: {
  interval: IntervalRecord;
  auth0: Auth0ContextInterface<User>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <button
      key={interval.id}
      role="button"
      bg="green-900 focus:green-800"
      border="rounded"
      text="xs gray-300 center"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      {interval.interval.beginning.toFormat("HH:mm")} -{" "}
      {interval.interval.end.isValid
        ? interval.interval.end.toFormat("HH:mm")
        : "now"}
      <IntervalEditor
        auth0={auth0}
        interval={interval}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};

export const MonthCalendar = ({ dates, date, auth0 }: Calendar) => {
  // While loading, display skeleton for number of dates
  const fallbackDates = daysOfMonth(date);

  return (
    <Transition
      w="full"
      h="min-content"
      show
      appear
      enter="ease-out duration-1000 delay-50"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        w="full"
        h="min-content"
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
                {target && <MonthTarget target={target} auth0={auth0} />}
              </div>

              {intervals.map((interval) => (
                <Transition.Child
                  key={interval.id}
                  appear
                  enter="ease-out duration-1000"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <MonthInterval interval={interval} auth0={auth0} />
                </Transition.Child>
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
    </Transition>
  );
};
