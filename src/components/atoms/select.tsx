import React, {
  DetailedHTMLProps,
  Fragment,
  HTMLAttributes,
  SelectHTMLAttributes,
  useRef,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  className?: string;
  size?: "small" | "default";
};

// interface Select<T extends SelectValue> {
//   selected: T;
//   values: T[];
//   setSelected: (selected: T) => void;
// }

const selectSizeClasses: Record<"small" | "default", string> = {
  small: "h-9 min-w-9 px-3 py-1.5 text-sm",
  default: "h-12 min-w-12 px-6 py-3",
};

export function Select<T extends SelectValue>({
  selected,
  values,
  setSelected,
  className = "",
  size = "default",
}: Select<T>) {
  return (
    <div className="text-gray-200">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className={`
              flex items-center justify-between gap-2 w-full
              ${selectSizeClasses[size]}
              rounded-lg
              bg-stone-800/50 
              text-gray-300 font-medium
              transition-all duration-200
              hover:bg-stone-700/50
              focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-stone-900
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              ${className}
            `}
          >
            <span className="block truncate">{selected.label}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-gray-400"
              aria-hidden="true"
            />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`
                absolute z-50 w-full mt-1 overflow-auto
                rounded-lg
                bg-stone-800/95 backdrop-blur-sm
                text-gray-300
                border border-stone-700
                focus:outline-none
                ${size === "small" ? "text-sm" : "text-base"}
                max-h-60
              `}
            >
              {values.map((value) => (
                <Listbox.Option
                  key={value.id}
                  value={value}
                  disabled={value.disabled}
                  className={({ active, selected }) => `
                    relative cursor-pointer select-none
                    ${selectSizeClasses[size]}
                    ${active || selected ? "bg-stone-700/50 text-gray-200" : "text-gray-300"}
                    ${selected ? "font-medium" : "font-normal"}
                    first:rounded-t-lg last:rounded-b-lg
                  `}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {value.label}
                    </span>
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
