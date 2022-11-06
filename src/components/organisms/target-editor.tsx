import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useContext } from "react";
import { useState } from "react";
import { z } from "zod";
import { Target } from "../../schema/calendar";
import { dateTimeToIso8601, durationToIso8601 } from "../../schema/custom";
import { useClient } from "../../supabase/use-client";
import { Button } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import DurationPicker from "../atoms/duration-picker";

const upsertTargetSchema = z.object({
  id: z.string().uuid().optional(),
  date: dateTimeToIso8601,
  duration: durationToIso8601,
});

const useUpsertTarget = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation(async (trackData: z.input<typeof upsertTargetSchema>) => {
    const upsertData = upsertTargetSchema.parse(trackData);
    const { data, error } = await client
      .from("targets")
      .upsert([{ ...upsertData }]);

    if (error) {
      console.error(error);
    }

    queryClient.refetchQueries(["calendar"]);

    return { data, error };
  });
};

const deleteTargetSchema = z.object({
  id: z.string().uuid(),
});

const useDeleteTarget = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation(async (params: z.input<typeof deleteTargetSchema>) => {
    const deleteFilter = deleteTargetSchema.parse(params);
    const { data, error } = await client
      .from("targets")
      .delete()
      .match(deleteFilter);

    if (error) {
      console.error(error);
    }

    queryClient.refetchQueries(["calendar"]);

    return { data, error };
  });
};

interface TargetEditor {
  target?: Target;
  isOpen: boolean;
  close: () => void;
}

export const TargetEditor = ({
  target: targetRecord,
  isOpen,
  close,
}: TargetEditor) => {
  const [targetDuration, setTargetDuration] = useState(targetRecord?.duration);
  const [targetDate, setTargetDate] = useState(targetRecord?.date);

  const { mutateAsync: upsertTarget } = useUpsertTarget();
  const { mutateAsync: deleteTarget } = useDeleteTarget();

  const updateTarget = async () => {
    if (
      targetDuration &&
      targetDuration.isValid &&
      targetDate &&
      targetDate.isValid
    ) {
      await upsertTarget({
        id: targetRecord?.id,
        date: targetDate,
        duration: targetDuration,
      });
      close();
    }
  };

  const removeTarget = async () => {
    if (targetRecord) {
      await deleteTarget(targetRecord);
      close();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 overflow-auto"
        open={isOpen}
        onClose={close}
      >
        <Dialog.Panel
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
            <div pos="fixed inset-0" bg="dark-400" opacity="70" />
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
              w="min-72"
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
                Target date
              </h4>

              <div m="b-4">
                <DatePicker currentDate={targetDate} pickDate={setTargetDate} />
              </div>

              <h4 text="sm gray-300" m="b-2">
                Duration
              </h4>

              <DurationPicker
                duration={targetDuration}
                setDuration={(d) => setTargetDuration(d)}
              />

              <div display="flex" flex="row" gap="4" m="t-8">
                <Button
                  flex="1"
                  text="green-300"
                  border="1 dark-50 hover:green-300 focus:green-300 rounded"
                  onClick={updateTarget}
                >
                  {targetRecord ? "Save" : "Save new"}
                </Button>
                {targetRecord && (
                  <Button
                    flex="1"
                    text="red-300"
                    border="1 dark-50 hover:red-300 focus:red-300 rounded"
                    onClick={removeTarget}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog.Panel>
      </Dialog>
    </Transition.Root>
  );
};
