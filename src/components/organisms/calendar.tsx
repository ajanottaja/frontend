import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import { CalendarDate, Target, Track } from "../../schema/calendar";
import { absDuration, daysOfMonth, daysOfWeek, getDurationFromTracks, isNegativeDuration } from "../../utils/date";
import { TrackEditor } from "./track-editor";
import { TargetEditor } from "./target-editor";

interface CalendarInput {
  date: DateTime;
  dates?: CalendarDate[];
}

const WeekTarget = ({ target }: { target: Target }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <button
      key={target.id}
      role="button"
      border="rounded"
      text="xs gray-300 center"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      <span display="<md:hidden">{target.duration.toFormat("hh:mm")}</span>
      <span display="md:hidden">{target.duration.toFormat("hh")}</span>
      <TargetEditor
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};

const WeekTrack = ({ track }: { track: Track }) => {
  const [isEditing, setIsEditing] = useState(false);
  const minutesPastMidnight = track.tracked.lower
    .diff(track.tracked.lower.startOf("day"))
    .as("minutes");
  const length = (
    track.tracked.upper?.isValid ? track.tracked.upper : DateTime.now()
  )
    .diff(track.tracked.lower)
    .as("minutes");
  return (
    <div
      pos="absolute"
      w="full"
      p="x-2"
      style={{
        top: minutesPastMidnight,
      }}
      onClick={() => setIsEditing(true)}
    >
      <button
        key={track.tracked.lower.toISODate()}
        display="flex"
        align="items-start"
        bg="green-900 focus:green-800"
        focus="outline-transparent"
        ring="1 transparent :focus:green-400"
        border="rounded"
        text="xs gray-300 focus:gray-200"
        p="1"
        m="b-1"
        w="full min-full"
        h="min-6"
        style={{
          height: `${length}px`,
        }}
      >
        <span display="<md:hidden">
          {track.tracked.lower.toFormat("HH:mm")} -{" "}
          {track.tracked.upper?.isValid
            ? track.tracked.upper.toFormat("HH:mm")
            : "now"}
        </span>
        <TrackEditor
          track={track}
          isOpen={isEditing}
          close={() => setIsEditing(false)}
        />
      </button>
    </div>
  );
};

export const WeekCalendar = ({ dates, date }: CalendarInput) => {
  const fallbackDates = daysOfWeek(date);
  return (
    <div
      display="flex"
      flex="col"
      justify="items-end"
      w="full"
      overflow="y-auto"
    >
      <div
        p="b-4"
        w="min-full full"
        display="grid"
        justify="items-stretch"
        grid="gap-1 cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
        text="gray-400"
      >
        <div text="center" display="<md:hidden">
          Target
        </div>
        <div text="center" display="md:hidden">
          <FontAwesomeIcon icon={faBullseye} />
        </div>
        {dates &&
          dates.map(({ target }) =>
            target ? <WeekTarget target={target} /> : <div />
          )}
        <div display="grid" grid="rows-24 gap-1">
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].map((hour) => {
            return (
              <div
                display="flex"
                justify="center"
                bg="dark-500"
                text="gray-600"
                h="full"
                w="full"
              >
                <span>
                  {DateTime.fromObject({ hour, minute: 0, second: 0 }).toFormat(
                    "HH"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        {dates &&
          dates.map(({ date, target, tracks }, i) => (
            <div
              display="grid"
              grid="rows-24 gap-1"
              h="[1440px]"
              pos="relative"
            >
              {tracks.map((track) => (
                <WeekTrack track={track} />
              ))}
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
              ].map((hour) => {
                return <div bg="dark-500" h="full"></div>;
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

const MonthTarget = ({ target, tracks }: { target: Target, tracks: Track[] }) => {
  const [isEditing, setIsEditing] = useState(false);

  const duration = getDurationFromTracks(tracks);

  const formatDuration = (
    d: Duration | undefined = Duration.fromMillis(0),
    format: string
  ) => absDuration(d).toFormat(format);

  const isOverTarget = target.duration < duration;
  return (
    <button
      key={target.id}
      role="button"
      border="rounded"
      text="xs gray-300 right"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      <span text={isOverTarget ? "green-300" : "red-300"}>{formatDuration(duration, "hh:mm")} </span>
      <span>/ {target.duration.toFormat("hh:mm")}</span>
      <TargetEditor
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};

const MonthTrack = ({ track }: { track: Track }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <button
      key={track.id}
      role="button"
      bg="green-900 focus:green-800"
      border="rounded"
      text="xs gray-300 center"
      outline="focus:none"
      focus="animate-pulse"
      w="full"
      p="1"
      m="b-1"
      onClick={() => setIsEditing(true)}
    >
      {track.tracked.lower.toFormat("HH:mm")} -{" "}
      {track.tracked.upper?.isValid
        ? track.tracked.upper.toFormat("HH:mm")
        : "now"}
      <TrackEditor
        track={track}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </button>
  );
};

export const MonthCalendar = ({ dates, date }: CalendarInput) => {
  // While loading, display skeleton for number of dates
  const fallbackDates = daysOfMonth(date);

  return (
    <div
      w="full"
      h="min-content"
      flex="grow"
      display="grid"
      grid="gap-1 md:cols-7"
      text="gray-400"
      className="grid-auto-fit"
    >
      {dates &&
        dates.map(({ date, target, tracks }, i) => (
          <div
            key={date.toISODate()}
            display="flex"
            bg="dark-500"
            flex="col"
            h="min-28"
            w="min-24"
            p="1"
            className={
              i !== 0 ? "" : `<md:col-start-1 col-start-${date.weekday}`
            }
          >
            <div display="flex" flex="row" justify="between" p="b-2">
              <span text="gray-500">{date.day}</span>
              {target && <MonthTarget target={target} tracks={tracks} />}
            </div>

            {tracks.map((track) => (
              <MonthTrack key={track.id} track={track} />
            ))}
          </div>
        ))}

      {!dates &&
        fallbackDates.map((date, i) => (
          <div
            key={date.toISODate()}
            display="flex"
            bg="dark-500"
            flex="col"
            h="min-28"
            w="min-24"
            p="1"
            className={
              i !== 0 ? "" : `<md:col-start-1 col-start-${date.weekday}`
            }
          >
            <div display="flex" flex="row" justify="between" p="b-2">
              <span text="gray-500">{date.day}</span>
            </div>
          </div>
        ))}
    </div>
  );
};
