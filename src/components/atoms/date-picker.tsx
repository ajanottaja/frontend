import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition, PopoverButton, PopoverPanel } from "@headlessui/react";
import { DateTime } from "luxon";
import { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { daysOfMonth, daysOfWeek, next, previous } from "../../utils/date";

interface DatePickerInner {
  activeDate: DateTime;
  pickDate: (date: DateTime) => void;
}

export const DatePickerInner = ({ activeDate, pickDate }: DatePickerInner) => {
  const [date, setDate] = useState(activeDate);
  const dates = daysOfMonth(date);
  const days = daysOfWeek(date).map((d) => d.weekdayShort);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setDate(previous("month", date)),
    onSwipedRight: () => setDate(next("month", date)),
  });

  const colStarts = [
    'col-start-1',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ];

  return (
    <div className="flex flex-col w-full text-gray-300 p-4" {...swipeHandlers}>
      <div className="flex flex-row justify-between items-center mb-4">
        <button
          aria-label="Go to previous month"
          className="p-2 hover:text-green-400 focus:text-green-400 focus:outline-none transition-colors duration-200"
          onClick={() => setDate(previous("month", date))}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        </button>
        <h1 className="text-lg font-medium">{date.toFormat("MMMM yyyy")}</h1>
        <button
          aria-label="Go to next month"
          className="p-2 hover:text-green-400 focus:text-green-400 focus:outline-none transition-colors duration-200"
          onClick={() => setDate(next("month", date))}
        >
          <FontAwesomeIcon icon={faArrowRight} size="sm" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((wd) => (
          <div key={wd} className="text-gray-500 text-center text-sm py-2">{wd}</div>
        ))}
        {dates.map((d, i) => (
          <button
            key={d.toISO()}
            className={`
              p-2 rounded-md text-right transition-all duration-200
              ${i === 0 ? colStarts[d.weekday - 1] : ""}
              ${d.equals(activeDate) 
                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30" 
                : "text-gray-300 hover:bg-stone-700/50"
              }
              focus:outline-none focus:ring-2 focus:ring-green-500/30
            `}
            onClick={() => pickDate(d)}
          >
            {d.day}
          </button>
        ))}
      </div>
    </div>
  );
};

type DatePicker = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  currentDate?: DateTime;
  pickDate: (date: DateTime) => void;
};

export const DatePicker = ({ currentDate, pickDate }: DatePicker) => {
  const defaultDate = currentDate?.startOf("day");
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            as="button"
            className={`
              flex items-center justify-between w-full px-4 py-3
              bg-stone-800/75 border border-stone-700/50 rounded-xl
              text-gray-300 transition-all duration-200
              hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/30
              cursor-pointer
            `}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendar} className="text-green-400/75" />
              {defaultDate ? (
                <span>{defaultDate?.toFormat("DDDD") ?? ""}</span>
              ) : (
                <span className="text-gray-500">
                  {DateTime.now().toFormat("DDDD")}
                </span>
              )}
            </div>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <PopoverPanel className="absolute z-50 w-full mt-2 bg-stone-900 backdrop-blur-sm border border-stone-700/30 rounded-xl shadow-xl">
              <DatePickerInner
                pickDate={(d) => {
                  pickDate(d);
                  close();
                }}
                activeDate={defaultDate ?? DateTime.now()}
              />
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
