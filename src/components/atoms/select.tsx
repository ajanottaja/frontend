import React, {
  DetailedHTMLProps,
  Fragment,
  HTMLAttributes,
  SelectHTMLAttributes,
  useRef,
} from "react";
import { Listbox, Transition } from "@headlessui/react";

interface SelectValue {
  id: string | number;
  label: string;
  disabled?: boolean;
}

type Select<T extends SelectValue> = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  selected: T;
  values: T[];
  setSelected: (selected: T) => void;
};

// interface Select<T extends SelectValue> {
//   selected: T;
//   values: T[];
//   setSelected: (selected: T) => void;
// }

export function Select<T extends SelectValue>({
  selected,
  values,
  setSelected,
  ...props
}: Select<T>) {
  return (
    <div text="gray-200" {...props}>
      <Listbox value={selected} onChange={setSelected}>
        <div pos="relative">
          <Listbox.Button
            w="full"
            pos="relative"
            display="flex"
            flex="row"
            justify="content-center"
            align="items-center"
            p="2 <sm:1"
            animate="hover:pulse focus:pulse"
            border="dark-50 1 hover:green-300 focus:green-300 rounded"
            outline="focus:none"
            text="gray-200 <sm:sm"
          >
            <div pos="absolute left-1 top-auto bottom-auto">
              <span className="icon-sm icon-select text-gray-300"></span>
            </div>
            <span text="truncate" m="l-6">
              {selected.label}
            </span>
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
              z="50"
              m="y-1"
              p="0"
              w="min-full"
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
                      {selected && (
                        <div pos="absolute left-1">
                          <span className="icon-check"></span>
                        </div>
                      )}
                      <span
                        display="block"
                        text={`center ${active ? "green-300" : ""}`}
                        m="x-6"
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
