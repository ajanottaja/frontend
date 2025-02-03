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
import { Modal } from "../atoms/modal";

const upsertTargetSchema = z.object({
  id: z.string().uuid().optional(),
  date: dateTimeToIso8601,
  duration: durationToIso8601,
});

const useUpsertTarget = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackData: z.input<typeof upsertTargetSchema>) => {
      const { id, ...dataWithoutId } = upsertTargetSchema.parse(trackData);

      const { data, error } = await client
        .from("targets")
        .upsert([id ? { ...dataWithoutId, id } : dataWithoutId]);

      if (error) {
        console.error(error);
        throw error;
      }

      queryClient.refetchQueries({ queryKey: ["calendar"] });
      return { data, error };
    },
  });
};

const deleteTargetSchema = z.object({
  id: z.string().uuid(),
});

const useDeleteTarget = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: z.input<typeof deleteTargetSchema>) => {
      const deleteFilter = deleteTargetSchema.parse(params);
      const { data, error } = await client
        .from("targets")
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
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={targetRecord ? "Edit Target" : "New Target"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Target date
          </h4>
          <DatePicker currentDate={targetDate} pickDate={setTargetDate} />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Duration
          </h4>
          <DurationPicker
            duration={targetDuration}
            setDuration={(d) => setTargetDuration(d)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white"
            onClick={updateTarget}
          >
            {targetRecord ? "Save" : "Save new"}
          </Button>
          {targetRecord && (
            <Button
              className="flex-1"
              onClick={removeTarget}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};