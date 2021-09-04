import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

interface SelectValue {
  id: string | number;
  label: string;
  disabled?: boolean;
}

interface Select<T extends SelectValue> {
  selected: T;
  values: T[];
  setSelected: (selected: T) => void;
}

export function Select<T extends SelectValue>({
  selected,
  values,
  setSelected,
}: Select<T>) {
  return (
    <div text="gray-200" w="w-32">
      <Listbox value={selected} onChange={setSelected}>
        <div pos="relative">
          <Listbox.Button
            w="full"
            pos="relative"
            display="flex"
            flex="row"
            justify="content-center"
            align="items-center"
            p="2"
            animate="hover:pulse focus:pulse"
            border="dark-50 1 hover:green-300 focus:green-300 rounded"
            outline="focus:none"
            text="gray-200"
          >
            <div pos="absolute left-1 top-auto bottom-auto">
              <span className="icon-sm icon-select text-gray-300"></span>
            </div>
            <span text="truncate">{selected.label}</span>
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              pos="absolute"
              m="y-1"
              p="0"
              w="full"
              bg="dark-800"
              shadow="~ light-100"
              border="1 dark-50 rounded"
              display="flex"
              flex="col"
              align="items-center"
            >
              {values.map((value) => (
                <Listbox.Option
                  key={value.id}
                  value={value}
                  disabled={value.disabled}
                  pos="relative"
                  display="flex"
                  flex="row"
                  justify="center"
                  list="none"
                  className={({ active }) => `${active ? "bg-dark-400" : ""}`}
                  w="full"
                >
                  {({ active, selected }) => (
                    <>
                      {selected && <div pos="absolute left-1"><span className="icon-check"></span></div>}
                      <span
                        display="block"
                        text={`center ${active ? "green-300" : ""}`}
                      >
                        {value.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
