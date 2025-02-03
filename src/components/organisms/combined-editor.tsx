import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import { Track, Target } from "../../schema/calendar";
import { IconButton } from "../atoms/button";
import { DatePicker } from "../atoms/date-picker";
import TimePicker from "../molecules/time-picker";
import { Modal } from "../atoms/modal";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useClient } from "../../supabase/use-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { tsRangeObjectToString } from "../../schema/custom";
import DurationPicker from "../atoms/duration-picker";

interface CombinedEditorProps {
  isOpen: boolean;
  close: () => void;
  initialDate?: DateTime;
  track?: Track;
  target?: Target;
}

const upsertTrackSchema = z.object({
  id: z.string().uuid().optional(),
  tracked: tsRangeObjectToString,
});

const upsertTargetSchema = z.object({
  id: z.string().uuid().optional(),
  date: z.string(),
  duration: z.string(),
});

export const CombinedEditor = ({
  isOpen,
  close,
  initialDate = DateTime.now(),
  track,
  target,
}: CombinedEditorProps) => {
  const client = useClient();
  const queryClient = useQueryClient();

  // Track state
  const [trackStart, setTrackStart] = useState<DateTime>(
    track?.tracked.lower ?? initialDate.set({ hour: 8, minute: 0 }) // Default to 8 AM
  );
  const [trackEnd, setTrackEnd] = useState<DateTime | undefined>(
    // If there's an existing track, use its end time, otherwise set to 8 hours after start
    track?.tracked.upper ?? trackStart.plus({ hours: 8 })
  )

  // Target state
  const [targetDuration, setTargetDuration] = useState<Duration>(
    target?.duration ?? Duration.fromObject({ hours: 8 })
  );

  // Validation error state
  const [error, setError] = useState<string>();

  // Handle track start time change
  const handleStartChange = (newStart: DateTime) => {
    setError(undefined);
    // If end time exists, validate it's after start
    if (trackEnd && newStart >= trackEnd) {
      setError("Start time must be before end time");
      return;
    }
    const updatedStart = newStart.set({ 
      year: initialDate.year,
      month: initialDate.month,
      day: initialDate.day
    });
    setTrackStart(updatedStart);
    
    // If no end time is set, automatically set it to 1 hour after start
    if (!trackEnd) {
      setTrackEnd(updatedStart.plus({ hours: 1 }));
    }
  };

  // Handle track end time change
  const handleEndChange = (newEnd: DateTime | undefined) => {
    setError(undefined);
    if (newEnd) {
      // Validate end is after start
      if (newEnd <= trackStart) {
        setError("End time must be after start time");
        return;
      }
      // Set end time on same date as start
      setTrackEnd(newEnd.set({
        year: initialDate.year,
        month: initialDate.month,
        day: initialDate.day
      }));
    } else {
      setTrackEnd(undefined);
    }
  };

  const { mutateAsync: upsertTrack } = useMutation({
    mutationFn: async (trackData: z.input<typeof upsertTrackSchema>) => {
      const { id, ...dataWithoutId } = upsertTrackSchema.parse(trackData);

      const { data, error } = await client
        .from("tracks")
        .upsert([id ? { ...dataWithoutId, id } : dataWithoutId]);

      if (error) throw error;
      queryClient.refetchQueries({ queryKey: ["calendar"] });
      return { data, error };
    },
  });

  const { mutateAsync: upsertTarget } = useMutation({
    mutationFn: async (targetData: z.input<typeof upsertTargetSchema>) => {
      const { id, ...dataWithoutId } = upsertTargetSchema.parse(targetData);
      const { data, error } = await client
        .from("targets")
        .upsert([id ? { ...dataWithoutId, id } : dataWithoutId]);

      if (error) throw error;
      queryClient.refetchQueries({ queryKey: ["calendar"] });
      return { data, error };
    },
  });

  const handleSave = async () => {
    try {
      // Validate times before saving
      if (trackEnd && trackStart >= trackEnd) {
        setError("Start time must be before end time");
        return;
      }

      // Save track if start time is set
      if (trackStart) {
        await upsertTrack({
          id: track?.id,
          tracked: {
            lower: trackStart,
            lowerInclusive: true,
            upper: trackEnd,
            upperInclusive: false,
          },
        });
      }

      // Save target if duration is set
      await upsertTarget({
        id: target?.id,
        date: initialDate.toISODate(),
        duration: targetDuration.toISO(),
      });

      close();
    } catch (error) {
      console.error("Error saving:", error);
      setError("Failed to save changes");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={`Add Time Entry - ${initialDate.toFormat("dd LLL yyyy")}`}
    >
      <div className="space-y-8">
        {/* Track Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300">Time Interval</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Start</h4>
              <TimePicker 
                dateTime={trackStart} 
                setDateTime={handleStartChange}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">End</h4>
              <TimePicker
                dateTime={trackEnd}
                setDateTime={handleEndChange}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>
        </div>

        {/* Target Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300">Daily Target</h3>
          <DurationPicker
            duration={targetDuration}
            setDuration={setTargetDuration}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <IconButton
            icon={faCheck}
            ariaLabel="Save changes"
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 
              hover:from-green-500 hover:to-teal-500 text-white"
          >
            Save
          </IconButton>
          <IconButton
            icon={faTimes}
            ariaLabel="Cancel"
            onClick={close}
            className="flex-1 bg-stone-800 hover:bg-stone-700 text-gray-300"
          >
            Cancel
          </IconButton>
        </div>
      </div>
    </Modal>
  );
}; 