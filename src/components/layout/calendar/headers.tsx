import { DateTime, Duration } from "luxon";
import React, { useState } from "react";
import { daysOfWeek, getDurationFromTracks, isNegativeDuration, absDuration } from "../../../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { CalendarDate, Target, Track } from "../../../schema/calendar";
import { TargetEditor } from "../../organisms/target-editor";

const WeekDayHeader = ({ 
  date, 
  target, 
  tracks 
}: { 
  date: DateTime; 
  target?: Target; 
  tracks: Track[];
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const duration = getDurationFromTracks(tracks);
  const diff = target ? duration.minus(target.duration) : duration;
  const isOverTarget = !isNegativeDuration(diff);
  const isToday = date.hasSame(DateTime.now(), 'day');
  
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
    <div className={`flex flex-col items-center ${
      isToday ? 'text-green-400' : 'text-gray-400'
    }`}>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium">{date.toFormat('ccc')}</span>
        <span className="text-xs opacity-75">{date.toFormat('d')}</span>
      </div>
      {target && (
        <div
          role="button"
          className="flex items-center gap-2 px-2 py-1 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-xs text-gray-400">{target.duration.toFormat("h'h'")}</span>
          <span className={`text-xs ${isOverTarget ? 'text-green-400' : 'text-red-400'}`}>
            {formatDiff(diff)}
          </span>
          <TargetEditor
            target={target}
            isOpen={isEditing}
            close={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
};

export const WeekHeader = ({ dates }: { dates?: CalendarDate[] }) => {
  return (
    <div className="max-w-7xl w-full mx-auto px-6 md:px-0">
      <div className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 mt-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faBullseye} className="text-gray-400" />
        </div>
        {dates?.map(({ date, target, tracks }, i) => (
          <WeekDayHeader 
            key={date.toISODate()} 
            date={date} 
            target={target ?? undefined} 
            tracks={tracks} 
          />
        ))}
      </div>
    </div>
  );
};

export const MonthHeader = () => {
  return (
    <div className="max-w-7xl w-full mx-auto px-6 md:px-0">
      <div className="hidden md:grid grid-cols-7 gap-1 mt-4 pb-4 text-gray-300 text-sm">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} className="text-center">
            <span>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
