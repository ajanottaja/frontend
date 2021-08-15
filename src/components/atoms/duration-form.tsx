import React, { useState, useRef, useEffect, LegacyRef } from 'react';
import {Button} from './button';

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
    className="dark:bg-gray-700 text-2xl dark:text-green-300 dark:placeholder-gray-500 mx-1 py-1 w-1em text-center rounded outline-none focus:ring focus:ring-1 focus:ring-green-300 focus:animate-pulse caret-transparent"
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


const DurationForm = () => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number[]>([]);

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

  console.log("Position", position);

  return <form
    display="flex"
    flex="col"
    justify="center"
    onSubmit={() => {
      const duration = ""
    }}
  >
    <div
      display="flex"
      flex="row"
      justify="center"
      align="items-center"
      m="b-8">
      {inputFields.slice(0, 2)}
      <span className="text-green-300 text-2xl">:</span>
      {inputFields.slice(-2, inputFields.length)}
    </div>
    <Button hasFocus={position === 4}>Set target</Button>
  </form>
}

export default DurationForm;