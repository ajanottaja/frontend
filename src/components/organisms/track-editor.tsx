import { faTimes, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";

import { Button } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import TimePicker from "../molecules/time-picker";
import { Track } from "../../schema/calendar";
import { useClient } from "../../supabase/use-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { tsRangeObjectToString } from "../../schema/custom";
import { IconButton } from "../atoms/button";
import { Modal } from "../atoms/modal";

const upsertTrackSchema = z.object({
  id: z.string().uuid().optional(),
  tracked: tsRangeObjectToString,
});

const useUpsertTrack = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackData: z.input<typeof upsertTrackSchema>) => {
      const { id, ...dataWithoutId } = upsertTrackSchema.parse(trackData);
      const { data, error } = await client
      .from("tracks")
      .upsert([{ ...dataWithoutId, id }]);

      console.log("Upserted track", { ...dataWithoutId, id });

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
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={track ? "Edit Interval" : "New Interval"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Beginning
          </h4>
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
          <TimePicker
            dateTime={currTrack.lower}
            setDateTime={(d) =>
              setCurrTrack({
                ...currTrack,
                lower: d,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            End
          </h4>
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
        </div>

        <div className="flex gap-3 pt-2">
          <IconButton
            onClick={updateTrack}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white"
            icon={faSave}
            ariaLabel={track ? "Save interval" : "Create interval"}
          >
            {track ? "Save" : "Create"}
          </IconButton>
          {track && (
            <IconButton
              onClick={removeInterval}
              className="flex-1"
              icon={faTrash}
              ariaLabel="Delete interval"
            >
              Delete
            </IconButton>
          )}
        </div>
      </div>
    </Modal>
  );
};
