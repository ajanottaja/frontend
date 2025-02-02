import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";

import { Button } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import TimePicker from "../atoms/time-picker";
import { Track } from "../../schema/calendar";
import { useClient } from "../../supabase/use-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { tsRangeObjectToString } from "../../schema/custom";

const upsertTrackSchema = z.object({
  id: z.string().uuid().optional(),
  tracked: tsRangeObjectToString,
});

const useUpsertTrack = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackData: z.input<typeof upsertTrackSchema>) => {
      const upsertData = upsertTrackSchema.parse(trackData);
      const { data, error } = await client
      .from("tracks")
      .upsert([{ ...upsertData }]);

    if (error) {
      console.error(error);
    }

      queryClient.refetchQueries({ queryKey: ["calendar"] });

      return { data, error };
    },
  });
};

const deleteTrackSchema = z.object({
  id: z.string().uuid(),
});

const useDeleteTrack = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: z.input<typeof deleteTrackSchema>) => {
      const deleteFilter = deleteTrackSchema.parse(params);
      const { data, error } = await client
        .from("tracks")
      .delete()
      .match(deleteFilter);

    if (error) {
      console.error(error);
    }

      queryClient.refetchQueries({ queryKey: ["calendar"] });

      return { data, error };
    },
  });
};

interface TrackEditor {
  track?: Track;
  isOpen: boolean;
  close: () => void;
}

export const TrackEditor = ({ track, isOpen, close }: TrackEditor) => {
  const [currTrack, setCurrTrack] = useState<Track["tracked"]>(
    track?.tracked ?? {
      lower: DateTime.now(),
      lowerInclusive: true,
      upperInclusive: false,
    }
  );

  const { mutateAsync: upsertTrack } = useUpsertTrack();
  const { mutateAsync: deleteTrack } = useDeleteTrack();

  const updateTrack = async () => {
    await upsertTrack({ id: track?.id, tracked: currTrack });
    close();
  };

  const removeInterval = async () => {
    if (track) {
      await deleteTrack(track);
      close();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment} appear>
      <Dialog as="div" className="relative z-10" open={isOpen} onClose={close}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div pos="inset-0 fixed" bg="dark-400" opacity="bg-70" />
        </TransitionChild>

        <div
          pos="fixed inset-0"
          display="flex"
          flex="col"
          justify="center"
          align="items-center"
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              display="flex"
              flex="col"
              w="min-72 <sm:min-screen"
              h="<sm:min-screen"
              p="4"
              m="y-8 <sm:0"
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
              <DialogTitle as="h3" text="lg gray-300 center" m="0 b-4">
                Interval editor
              </DialogTitle>

              <h4 text="sm gray-300" m="b-2">
                Beginning
              </h4>

              <div m="b-4">
                <DatePicker
                  currentDate={currTrack.lower}
                  pickDate={(d) => {
                    setCurrTrack({
                      ...currTrack,
                      lower: currTrack.lower.set({
                        year: d.year,
                        month: d.month,
                        day: d.day,
                      }),
                    });
                  }}
                />
              </div>

              <TimePicker
                dateTime={currTrack.lower}
                setDateTime={(d) =>
                  setCurrTrack({
                    ...currTrack,
                    lower: d,
                  })
                }
              />

              <h4 text="sm gray-300" m="b-2 t-4">
                End
              </h4>

              <div m="b-4">
                <DatePicker
                  currentDate={
                    currTrack.upper && currTrack.upper.isValid
                      ? currTrack.upper
                      : undefined
                  }
                  pickDate={(d) => {
                    setCurrTrack({
                      ...currTrack,
                      upper: (currTrack?.upper ?? DateTime.now()).set({
                        year: d.year,
                        month: d.month,
                        day: d.day,
                      }),
                    });
                  }}
                />
              </div>

              <TimePicker
                dateTime={
                  currTrack.upper && currTrack.upper.isValid
                    ? currTrack.upper
                    : undefined
                }
                setDateTime={(d) =>
                  setCurrTrack({
                    ...currTrack,
                    upper: d,
                  })
                }
              />

              <div display="flex" flex="row" gap="4" m="t-8">
                <Button
                  flex="1"
                  text="green-300"
                  border="1 dark-50 hover:green-300 focus:green-300 rounded"
                  onClick={updateTrack}
                >
                  {track ? "Save" : "Create"}
                </Button>
                {track && (
                  <Button
                    flex="1"
                    text="red-300"
                    border="1 dark-50 hover:red-300 focus:red-300 rounded"
                    onClick={removeInterval}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
