import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import { CalendarDate, Target, Track } from "../../schema/calendar";
import { absDuration, daysOfMonth, daysOfWeek, getDurationFromTracks, isNegativeDuration } from "../../utils/date";
import { TrackEditor } from "./track-editor";
import { TargetEditor } from "./target-editor";
import { Button, IconButton } from "../atoms/button";
import { CombinedEditor } from "./combined-editor";

interface CalendarInput {
  date: DateTime;
  dates?: CalendarDate[];
}

const WeekTarget = ({ target, tracks }: { target: Target, tracks: Track[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const duration = getDurationFromTracks(tracks);
  const diff = duration.minus(target.duration);
  const isOverTarget = !isNegativeDuration(diff);
  
  const formatDiff = (d: Duration) => {
    const absDur = absDuration(d);
    const hours = absDur.as('hours');
    
    let format = '';
    if (hours < 1) {
      format = "m'm'";
    } else if (hours < 10) {
      format = "h'h' m'm'";
    } else {
      format = "h'h'";
    }
    
    return `${isNegativeDuration(d) ? "-" : "+"}${absDur.toFormat(format)}`;
  };

  return (
    <div
      role="button"
      className="flex flex-col items-center gap-1 px-2 py-1 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-xs text-gray-500">
        {target.duration.toFormat("h'h'")}
      </span>
      <span className={`text-sm font-medium ${isOverTarget ? 'text-green-400' : 'text-red-400'}`}>
        {formatDiff(diff)}
      </span>
      <TargetEditor
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </div>
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
      className="absolute w-full px-1"
      style={{
        top: minutesPastMidnight,
      }}
      onClick={() => setIsEditing(true)}
    >
      <button
        key={track.tracked.lower.toISODate()}
        className="group flex items-start w-full min-h-6 px-3 py-1.5 rounded
                   bg-stone-800 hover:bg-stone-700
                   border-l-2 border-green-600/50
                   transition-all duration-200"
        style={{
          height: `${length}px`,
        }}
      >
        <span className="text-xs text-gray-300 group-hover:text-gray-200 transition-colors">
          {track.tracked.lower.toFormat("HH:mm")}
          {track.tracked.upper?.isValid && (
            <span className="text-gray-400">
              {" - "}
              {track.tracked.upper.toFormat("HH:mm")}
            </span>
          )}
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
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = DateTime.now().startOf('day');
  
  return (
    <div className="flex flex-col w-full overflow-y-auto pt-2">
      <div className="w-full min-w-full grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2">
        {/* Time column */}
        <div className="grid grid-rows-24 gap-0">
          {hours.map((hour) => (
            <div key={hour} className="flex justify-end pr-4 items-center h-full">
              <span className="text-xs text-gray-400">
                {DateTime.fromObject({ hour }).toFormat("HH")}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns with tracks */}
        {dates?.map(({ date: cellDate, tracks }, i) => {
          const isToday = cellDate.hasSame(today, 'day');
          return (
            <div key={i} className="relative">
              <div className={`grid grid-rows-24 gap-0 h-[1440px] rounded-lg ${
                isToday ? 'bg-stone-800/20' : 'bg-stone-800/5'
              }`}>
                {tracks.map((track) => (
                  <WeekTrack key={track.id} track={track} />
                ))}
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="border-b border-stone-700/5"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthTarget = ({ target, tracks }: { target: Target, tracks: Track[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const duration = getDurationFromTracks(tracks);
  const diff = duration.minus(target.duration);
  const isOverTarget = !isNegativeDuration(diff);
  
  const formatDiff = (d: Duration) => {
    const absDur = absDuration(d);
    const hours = absDur.as('hours');
    
    let format = '';
    if (hours < 1) {
      format = "m'm'";
    } else if (hours < 10) {
      format = "h'h' m'm'";
    } else {
      format = "h'h'";
    }
    
    return `${isNegativeDuration(d) ? "-" : "+"}${absDur.toFormat(format)}`;
  };

  return (
    <>
      <button 
        className={`text-xs ${isOverTarget ? 'text-green-300' : 'text-red-300'}
        cursor-pointer
                   hover:underline focus:underline`}
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {formatDiff(diff)}
      </button>
      <TargetEditor
        target={target}
        isOpen={isEditing}
        close={() => setIsEditing(false)}
      />
    </>
  );
};

const MonthTrack = ({ track, onEdit }: { track: Track; onEdit: () => void }) => {
  const timeText = track.tracked.upper?.isValid
    ? `${track.tracked.lower.toFormat("HH:mm")} - ${track.tracked.upper.toFormat("HH:mm")}`
    : track.tracked.lower.toFormat("HH:mm");

  return (
    <span className="block text-xs text-gray-300">
      {timeText}
    </span>
  );
};

export const MonthCalendar = ({ dates, date }: CalendarInput) => {
  const [editingDate, setEditingDate] = useState<DateTime>();
  const [editingTrack, setEditingTrack] = useState<Track>();
  const [editingTarget, setEditingTarget] = useState<Target>();

  const fallbackDates = daysOfMonth(date);

  const colStarts = [
    'md:col-start-1',
    'md:col-start-2',
    'md:col-start-3',
    'md:col-start-4',
    'md:col-start-5',
    'md:col-start-6',
    'md:col-start-7',
  ];

  return (
    <div className="w-full h-min-content flex-grow grid gap-3 md:grid-cols-7 text-gray-400">
      {dates &&
        dates.map(({ date, target, tracks }, i) => {
          const isToday = date.toISODate() === DateTime.now().toISODate();
          return (
            <div
              key={date.toISODate()}
              className={`flex flex-col min-h-28 min-w-24 ${
                i !== 0 ? "" : `col-start-1 ${colStarts[date.weekday - 1]}`
              }`}
            >
              <div className="flex-1 rounded-xl bg-stone-800/30 backdrop-blur-sm p-3 
                            hover:bg-stone-800/40 focus-within:bg-stone-800/40 
                            transition-colors group flex flex-col">
                {/* Header with date and target */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {date.day}
                    </span>
                    <span className="text-xs text-gray-400 md:hidden">
                      {date.toFormat('ccc')}
                    </span>
                  </div>
                  {target && <MonthTarget target={target} tracks={tracks} />}
                </div>

                {/* Tracks list */}
                <div className="flex-1">
                  {tracks.length > 0 && (
                    <div className="space-y-0.5 pt-2 border-t border-stone-700/20">
                      {tracks.map((track) => (
                        <Button
                          key={track.id}
                          size="xsmall"
                          tabIndex={0}
                          className="w-full px-3 py-1.5 rounded text-left hover:bg-stone-700/50 transition-colors cursor-pointer"
                          onClick={() => setEditingTrack(track)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setEditingTrack(track);
                            }
                          }}
                        >
                          <MonthTrack track={track} onEdit={() => setEditingTrack(track)} />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  size="xsmall"
                  className="w-full mt-2 px-3 py-1.5 rounded-lg text-left text-xs 
                            text-gray-400/0 group-hover:text-gray-400 group-focus-within:text-gray-400
                            hover:bg-stone-700/50 transition-all
                            opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  onClick={() => setEditingDate(date)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setEditingDate(date);
                    }
                  }}
                >
                  + Add entry
                </Button>
              </div>
            </div>
          );
        })}

      {/* Fallback skeleton loading state */}
      {!dates &&
        fallbackDates.map((date, i) => (
          <div
            key={date.toISODate()}
            className={`flex flex-col min-h-28 min-w-24 ${
              i !== 0 ? "" : `md:col-start-${date.weekday} col-start-1`
            }`}
          >
            <div className="flex-1 rounded-xl bg-stone-800/20 p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">{date.day}</span>
                  <span className="text-xs text-gray-400 md:hidden">
                    {date.toFormat('ccc')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Editors */}
      {editingDate && (
        <CombinedEditor
          isOpen={!!editingDate}
          close={() => setEditingDate(undefined)}
          initialDate={editingDate}
          target={editingTarget}
          track={editingTrack}
        />
      )}
      {editingTrack && (
        <TrackEditor
          track={editingTrack}
          isOpen={!!editingTrack}
          close={() => setEditingTrack(undefined)}
        />
      )}
      {editingTarget && (
        <TargetEditor
          target={editingTarget}
          isOpen={!!editingTarget}
          close={() => setEditingTarget(undefined)}
        />
      )}
    </div>
  );
};

export const DayCalendar = ({ dates, date }: CalendarInput) => {
  const tracks = dates?.[0]?.tracks || [];
  const target = dates?.[0]?.target;

  return (
    <div className="flex flex-col justify-items-end w-full overflow-y-auto">
      <div className="pb-4 w-full min-w-full grid justify-items-stretch gap-1 grid-cols-[4rem_1fr] text-gray-400">
        <div className="text-center md:hidden">
          Target
        </div>
        <div className="text-center hidden md:block">
          <FontAwesomeIcon icon={faBullseye} />
        </div>
        {target ? <MonthTarget target={target} tracks={tracks} /> : <div />}

        <div className="grid grid-rows-24 gap-1">
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].map((hour) => (
            <div
              key={hour}
              className="flex justify-center bg-stone-800/50 text-gray-600 h-full w-full"
            >
              <span>
                {DateTime.fromObject({ hour, minute: 0, second: 0 }).toFormat(
                  "HH"
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-rows-24 gap-1 h-[1440px] relative">
          {tracks.map((track) => (
            <WeekTrack key={track.id} track={track} />
          ))}
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].map((hour) => (
            <div key={hour} className="bg-stone-800/50 h-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
