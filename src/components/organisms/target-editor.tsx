import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useContext } from "react";
import { useState } from "react";
import { TargetRecord } from "../../api/calendar";
import { updateTarget, deleteTarget } from "../../api/target";
import { Button } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import DurationPicker from "../atoms/duration-picker";
import TimePicker from "../atoms/time-picker";
import SwrMutateContext from "../providers/swr-mutation-provider";

interface TargetEditor {
  target: TargetRecord;
  isOpen: boolean;
  auth0: Auth0ContextInterface<User>;
  close: () => void;
}

export const TargetEditor = ({
  target: targetRecord,
  isOpen,
  auth0,
  close,
}: TargetEditor) => {
  const [targetDuration, setTargetDuration] = useState(targetRecord.duration);
  const { mutate } = useContext(SwrMutateContext);

  const saveTarget = async () => {
    const res = await updateTarget({
      auth0,
      path: { id: targetRecord.id },
      body: { duration: targetDuration },
    });
    if (res.status === 200) {
      close();
      mutate();
    }
  };

  const removeTarget = async () => {
    const res = await deleteTarget({
      auth0,
      path: { id: targetRecord.id },
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
                onClick={close}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <Dialog.Title as="h3" text="lg gray-300 center" m="0 b-4">
                Target editor
              </Dialog.Title>

              <h4 text="sm gray-300" m="b-2">
                Duration
              </h4>

              <DurationPicker
                duration={targetDuration}
                setDuration={d => setTargetDuration(d)}
              />

              <div display="flex" flex="row" justify="between" m="t-8">
                <Button
                  text="green-300"
                  border="1 dark-50 hover:green-300 focus:green-300 rounded"
                  onClick={saveTarget}
                >
                  Save
                </Button>
                <Button
                  text="red-300"
                  border="1 dark-50 hover:red-300 focus:red-300 rounded"
                  onClick={removeTarget}
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
