import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { DateTime } from "luxon";
import React, { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";
import { useState } from "react";
import { daysOfMonth, daysOfWeek, next, previous } from "../../utils/date";

interface DatePickerInner {
  activeDate: DateTime;
  pickDate: (date: DateTime) => void;
}

export const DatePickerInner = ({ activeDate, pickDate }: DatePickerInner) => {
  const [date, setDate] = useState(activeDate);
  const dates = daysOfMonth(date);
  const days = daysOfWeek(date).map((d) => d.weekdayShort);

  return (
    <div display="flex" flex="col" w="full" text="gray-300" p="4">
      <div display="flex" flex="row" justify="between">
        <button
          aria-label="Go to previous month"
          text="hover:green-300 focus:green-300"
          outline="focus:none"
          focus="animate-pulse"
          onClick={() => setDate(previous("month", date))}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        </button>
        <h1 text="center">{date.toFormat("MMMM yyyy")}</h1>
        <button
          aria-label="Go to next month"
          text="hover:green-300 focus:green-300"
          outline="focus:none"
          focus="animate-pulse"
          onClick={() => setDate(next("month", date))}
        >
          <FontAwesomeIcon icon={faArrowRight} size="sm" />
        </button>
      </div>
      <div display="grid" grid="cols-7 gap-1">
        {days.map((wd) => (
          <div text="gray-400 center">{wd}</div>
        ))}
        {dates.map((d, i) => (
          <button
            bg={d.equals(activeDate) ? "dark-600" : "dark-500"}
            p="1"
            className={i === 0 ? `col-start-${d.weekday}` : ""}
            text={`${d.equals(activeDate) ? "green-300" : "gray-300"} right`}
            border="1 transparent hover:green-300 focus:green-300"
            focus="animate-pulse"
            onClick={() => pickDate(d)}
          >
            {d.day}
          </button>
        ))}
      </div>
    </div>
  );
};

type DatePicker = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  currentDate?: DateTime;
  pickDate: (date: DateTime) => void;
}

export const DatePicker = ({ currentDate, pickDate }: DatePicker) => {
  const defaultDate = (currentDate ?? DateTime.now()).startOf("day");
  return (
    <Popover pos="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            as="button"
            display="flex"
            flex="row"
            align="items-center"
            justify="between"
            bg="dark-500"
            border="1 rounded dark-50"
            p="2"
            w="full"
            text="gray-300"
          >
            <FontAwesomeIcon icon={faCalendar} />
            <span m="l-2">
              {(defaultDate ?? DateTime.now()).toFormat("DDDD")}
            </span>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              className="absolute z-100"
              m="t-2"
              w="min-96"
              bg="dark-800"
              shadow="~"
              border="rounded-lg 1 dark-300"
            >
              <DatePickerInner
                pickDate={(d) => {
                  pickDate(d);
                  close();
                }}
                activeDate={defaultDate}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
