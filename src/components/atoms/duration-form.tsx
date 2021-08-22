import { Duration } from 'luxon';
import React, { useState, useRef, useEffect, LegacyRef } from 'react';
import { Button } from './button';

const durationToNumbers = (duration: Duration) => {
  return [...duration.toFormat("hhmm")].map(x => Number.parseInt(x, 10))
}

interface DurationInput {
  value?: number;
  setValue: (newVal: string) => void;
  pasteValue: (newVal: string) => void;
  name: string;
  isEditing?: boolean;
  onFocus: () => void
};


const DigitInput = ({ name, value, setValue, pasteValue, isEditing, onFocus }: DurationInput) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing])
  return (<input
    type="number"
    onFocus={onFocus}
    bg="dark:dark-200"
    text="5xl <lg:3xl dark:green-300 dark:placeholder-gray-500"
    font="mono"
    className="mx-1 py-1 w-1em text-center rounded outline-none focus:ring focus:ring-1 focus:ring-green-300 focus:animate-pulse caret-transparent"
    name={name}
    ref={inputRef}
    min={0}
    max={9}
    pattern="\d"
    onChange={(e) => setValue(e.target.value)}
    onPaste={(e) => pasteValue(e.clipboardData.getData("Text"))}
    value={value}
    placeholder="0"
  />)
}

interface DurationForm {
  activeTarget?: Duration;
  setActiveTarget: (duration: Duration) => void
}

const DurationForm = ({activeTarget, setActiveTarget}: DurationForm) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number[]>(activeTarget ? durationToNumbers(activeTarget): []);

  const updateDuration = (newVal: string) => {
    setPosition(position + 1);
    duration[position] = Number.parseInt(newVal.slice(-1, newVal.length));
    setDuration(duration);
  };

  const pasteDuration = (newVal: string) => {
    const newVals = [...newVal].slice(0, 4).map(x => Number.parseInt(x, 10));
    setDuration(newVals);
    setPosition(4);
  };

  const inputFields = [1, 2, 1, 2].map((n, i) => {
    const id = i < 2 ? `Hour ${n}` : `Minute ${n}`;
    return <DigitInput
      key={id}
      name={id}
      value={duration[i]}
      setValue={updateDuration}
      pasteValue={pasteDuration}
      onFocus={() => setPosition(i)}
      isEditing={position === i} />
  });

  return <form
    display="grid" grid="cols-1 gap-y-8 <lg:gap-y-4" justify="self-center" text="center"
    onSubmit={(e) => {
      e.preventDefault();
      const target = Duration.fromObject({
        hours: Number.parseInt(`${duration[0]}${duration[1]}`, 10),
        minutes: Number.parseInt(`${duration[2]}${duration[3]}`, 10)
      });
      setActiveTarget(target);
    }}
  >
    <h2 text="4xl <lg:3xl dark:gray-300">Todays target</h2>
    <div
      display="flex"
      flex="row"
      justify="center"
      align="items-center">
      {inputFields.slice(0, 2)}
      <span text="green-300 4xl <lg:2xl">:</span>
      {inputFields.slice(-2, inputFields.length)}
    </div>
    <Button hasFocus={position === 4}>Set target</Button>
  </form>
}

export default DurationForm;