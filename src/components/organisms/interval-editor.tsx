import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useContext } from "react";
import { useState } from "react";
import { IntervalRecord } from "../../api/calendar";
import { updateInterval } from "../../api/interval";
import { Button } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import TimePicker from "../atoms/time-picker";
import SwrMutateContext from "../providers/swr-mutation-provider";

interface IntervalEditor {
  interval: IntervalRecord;
  isOpen: boolean;
  auth0: Auth0ContextInterface<User>;
  close: () => void;
}

export const IntervalEditor = ({
  interval: intervalRecord,
  isOpen,
  auth0,
  close,
}: IntervalEditor) => {
  const [interval, setInterval] = useState(intervalRecord.interval);
  const { mutate } = useContext(SwrMutateContext);

  const saveInterval = async () => {
    const res = await updateInterval({
      auth0,
      path: { id: intervalRecord.id },
      body: { interval },
    });
    if (res.status === 200) {
      close();
      mutate();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 overflow-auto"
        onClose={close}
      >
        <div
          h="min-screen"
          w="min-screen"
          pos="relative"
          display="flex"
          flex="col"
          justify="center"
          align="items-center"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-70"
            leave="ease-in duration-200"
            leaveFrom="opacity-70"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay pos="fixed inset-0" bg="dark-400" opacity="70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              display="flex"
              flex="col"
              p="4"
              m="y-8"
              bg="dark-800"
              border="rounded-lg 1 dark-300"
              overflow="visible"
              shadow="xl"
              transform="~"
              transition="all"
              opacity="100"
              pos="relative"
            >
              <button
                aria-label="Close editor"
                pos="absolute right-4"
                text="gray-500"
                outline="focus:none"
                p="1"
                focus="animate-pulse"
                onClick={close}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <Dialog.Title as="h3" text="lg gray-300 center" m="0 b-4">
                Interval editor
              </Dialog.Title>

              <h4 text="sm gray-300" m="b-2">
                Beginning
              </h4>

              <div m="b-4">
                <DatePicker
                  currentDate={interval.beginning}
                  pickDate={(d) => {
                    setInterval({
                      ...interval,
                      beginning: interval.beginning.set({
                        year: d.year,
                        month: d.month,
                        day: d.day,
                      }),
                    });
                  }}
                />
              </div>

              <TimePicker
                dateTime={interval.beginning}
                setDateTime={(d) =>
                  setInterval({
                    ...interval,
                    beginning: d,
                  })
                }
              />

              <h4 text="sm gray-300" m="b-2 t-4">
                End
              </h4>

              <div m="b-4">
                <DatePicker
                  currentDate={interval.end.isValid ? interval.end : undefined}
                  pickDate={(d) => {
                    setInterval({
                      ...interval,
                      end: interval.end.set({
                        year: d.year,
                        month: d.month,
                        day: d.day,
                      }),
                    });
                  }}
                />
              </div>

              <TimePicker
                dateTime={interval.end.isValid ? interval.end : undefined}
                setDateTime={(d) =>
                  setInterval({
                    ...interval,
                    end: d,
                  })
                }
              />

              <div display="flex" flex="row" justify="between" m="t-8">
                <Button
                  text="green-300"
                  border="1 dark-50 hover:green-300 focus:green-300 rounded"
                  onClick={saveInterval}
                >
                  Save
                </Button>
                <Button
                  text="red-300"
                  border="1 dark-50 hover:red-300 focus:red-300 rounded"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
