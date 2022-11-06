import {
  faCheck,
  faClock,
  faCross,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime, Duration } from "luxon";
import React, { useState, useRef, useEffect } from "react";

const dateTimeToNumbers = (date: DateTime) => {
  return [...date.toFormat("HHmm")].map((x) => Number.parseInt(x, 10));
};

const numbersToDateTime = (dateTime: DateTime, numbers: number[]) => {
  const hour = Number.parseInt(`${numbers[0]}${numbers[1]}`, 10);
  const minute = Number.parseInt(`${numbers[2]}${numbers[3]}`, 10);
  return dateTime.set({ hour, minute });
};

interface DurationInput {
  value?: number;
  max: number;
  setValue: (newVal: string) => void;
  pasteValue: (newVal: string) => void;
  name: string;
  isEditing?: boolean;
  onFocus: () => void;
}

const DigitInput = ({
  name,
  value,
  max,
  setValue,
  pasteValue,
  isEditing,
  onFocus,
}: DurationInput) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  return (
    <input
      type="number"
      onFocus={onFocus}
      bg="dark:dark-300"
      text="dark:gray-300 dark:placeholder-gray-500 center"
      font="mono"
      m="x-1"
      p="y-2 x-1"
      w="2em"
      className="caret-transparent"
      border="rounded 1 transparent"
      outline="none"
      ring="focus:1 focus:green-300"
      animate="focus:pulse"
      name={name}
      ref={inputRef}
      min={0}
      max={max}
      maxLength={1}
      pattern="\d"
      onChange={(e) => setValue(e.target.value)}
      onPaste={(e) => pasteValue(e.clipboardData.getData("Text"))}
      value={value}
      placeholder="0"
    />
  );
};

interface TimePicker {
  dateTime?: DateTime;
  setDateTime: (time: DateTime) => void;
}

const TimePicker = ({ dateTime: date, setDateTime: setDate }: TimePicker) => {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState(-1);
  const [time, setTime] = useState<number[]>(
    date ? dateTimeToNumbers(date) : []
  );

  const focus = () => {
    setActive(true);
    setPosition(0);
  };

  const updateTime = (newVal: string) => {
    setPosition(position + 1);
    const newTime = [...time];
    newTime[position] = Number.parseInt(
      newVal.slice(newVal.length - 1, newVal.length)
    );
    setTime(newTime);
  };

  const pasteTime = (newVal: string) => {
    const newVals = [...newVal].slice(0, 4).map((x) => Number.parseInt(x, 10));
    setTime(newVals);
    setPosition(4);
  };

  const inputFields = [
    { id: "hour1", max: 2 },
    { id: "hour2", max: 3 },
    { id: "minute1", max: 5 },
    { id: "minute2", max: 9 },
  ].map(({ id, max }, i) => {
    return (
      <DigitInput
        key={id}
        name={id}
        value={time[i]}
        max={max}
        setValue={updateTime}
        pasteValue={pasteTime}
        onFocus={() => setPosition(i)}
        isEditing={position === i}
      />
    );
  });

  return active ? (
    <div display="flex" flex="row" justify="center" align="items-center">
      {inputFields.slice(0, 2)}
      <span text="green-300">:</span>
      {inputFields.slice(-2, inputFields.length)}
      <button
        aria-label="Confirm time"
        border="rounded 1 dark-50 focus:green-300"
        text="green-300"
        animate="focus:pulse"
        w="2em"
        p="y-2"
        m="l-2"
        onClick={() => {
          setDate(numbersToDateTime(date ?? DateTime.now(), time));
          setActive(false);
        }}
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <button
        aria-label="Cancel time choice"
        animate="focus:pulse"
        text="red-300"
        w="2em"
        p="y-2"
        border="rounded 1 dark-50 focus:red-300"
        m="l-2"
        onClick={() => {
          setTime(date ? dateTimeToNumbers(date) : []);
          setActive(false);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  ) : (
    <button
      key="timepicker"
      aria-label="time-picker"
      aria-expanded={active}
      display="flex"
      flex="row"
      align="items-center"
      justify="between"
      bg="dark-500"
      border="1 rounded dark-50"
      p="2"
      w="full"
      text="gray-300"
      onClick={focus}
      //onFocus={focus}
    >
      <FontAwesomeIcon icon={faClock} />
      <span m="l-2">{(date ?? DateTime.now()).toFormat("HH:mm")}</span>
    </button>
  );
};

export default TimePicker;
