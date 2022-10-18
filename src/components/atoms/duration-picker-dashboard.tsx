import {
  faBullseye,
  faCheck,
  faClock,
  faCross,
  faPencilRuler,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime, Duration } from "luxon";
import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "./button";

const durationToNumbers = (duration: Duration) => {
  return [...duration.toFormat("hhmm")].map((x) => Number.parseInt(x, 10));
};

const numbersToDuration = (duration: Duration, numbers: number[]) => {
  const hours = Number.parseInt(`${numbers[0]}${numbers[1]}`, 10);
  const minutes = Number.parseInt(`${numbers[2]}${numbers[3]}`, 10);
  return duration.set({ hours, minutes });
};

interface DigitInput {
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
}: DigitInput) => {
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
      text="dark:gray-300 dark:placeholder-gray-500 center 4xl <lg:2xl"
      font="mono"
      m="x-1"
      p="y-2"
      w="1em"
      className="caret-transparent"
      border="rounded 1 transparent"
      outline="none"
      ring="1 transparent focus:green-300"
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

interface DurationInput {
  duration?: Duration;
  updateDuration: (newDuration: Duration) => void;
  cancel: () => void;
}

const DurationInput = ({ duration, updateDuration, cancel }: DurationInput) => {
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState<number[]>(
    duration ? durationToNumbers(duration) : []
  );

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

  return (
    <>
      <div display="flex" align="items-center">
        {inputFields.slice(0, 2)}
        <span text="green-300">:</span>
        {inputFields.slice(-2, inputFields.length)}
      </div>
      <div
        display="flex"
        flex="row"
        gap="4"
        justify="items-stretch"
        align="items-stretch"
        w="full"
      >
        <IconButton
          icon={faCheck}
          ariaLabel="Cancel"
          text="green-300"
          flex="1"
          onClick={() => {
            updateDuration(
              numbersToDuration(duration ?? Duration.fromMillis(0), time)
            );
          }}
        >
          Save
        </IconButton>
        <IconButton
          icon={faTimes}
          ariaLabel="Cancel"
          flex="1"
          text="red-300"
          onClick={cancel}
        >
          Cancel
        </IconButton>
      </div>
    </>
  );
};

interface DurationDisplay {
  duration?: Duration;
}

const DurationDisplay = ({ duration }: DurationDisplay) => {
  const formatted = duration?.toFormat("hh:mm") ?? "00:00";

  return (
    <div
      text={duration ? "gray-300 6xl <lg:4xl" : "gray-700 6xl <lg:4xl"}
      font="mono"
    >
      {formatted}
    </div>
  );
};

interface DurationPicker {
  duration?: Duration;
  setDuration: (duration: Duration) => void;
  title?: string;
}

const DurationPickerDashboard = ({
  duration,
  setDuration,
  title,
}: DurationPicker) => {
  const [active, setActive] = useState(false);

  const updateDuration = (duration: Duration) => {
    setDuration(duration);
    setActive(false);
  };

  return (
    <div
      display="grid"
      grid="cols-1 gap-y-8 <lg:gap-y-4"
      justify="self-center items-center"
    >
      {title && <h2 text="4xl <lg:3xl dark:gray-300">{title}</h2>}
      {active ? (
        <DurationInput
          duration={duration}
          updateDuration={updateDuration}
          cancel={() => setActive(false)}
        />
      ) : (
        <>
          <DurationDisplay duration={duration} />
          <IconButton
            icon={faBullseye}
            ariaLabel="Set target"
            w="full"
            onClick={() => {
              setActive(true);
            }}
          >
            Choose target
          </IconButton>
        </>
      )}
    </div>
  );
};

export default DurationPickerDashboard;
