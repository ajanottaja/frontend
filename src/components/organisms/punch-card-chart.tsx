import { ResponsiveSwarmPlot } from "@nivo/swarmplot"
import { DateTime, Duration } from "luxon"
import colors from "tailwindcss/colors"
import { Track } from "../../schema/calendar"
import { z } from "zod"
import { useClient } from "../../supabase/use-client"
import { useQuery } from "@tanstack/react-query"
import { iso8601ToDateTime } from "../../schema/custom"
import { tooltipTheme } from "../atoms/tooltip"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { IconButton } from "../atoms/button"
import { useState } from "react"
import { Tooltip } from "../atoms/tooltip"

// Schema for the work pattern data
const tracksSchema = z.object({
  tracked: z.object({
    lower: iso8601ToDateTime,
    upper: iso8601ToDateTime.optional(),
  })
});

const useTracks = (year: number) => {
  const client = useClient();
  return useQuery({
    queryKey: ["work-patterns", year],
    queryFn: async () => {
      const startDate = DateTime.fromObject({ year }).startOf('year').toISO();
      const endDate = DateTime.fromObject({ year }).endOf('year').toISO();
      
      const { data, error } = await client
        .from("tracks")
        .select("tracked::json")
        .overlaps('tracked', `[${startDate}, ${endDate}]`)
        .order("tracked", { ascending: true });
      
      if (error) throw error;
      return z.array(tracksSchema).parse(data);
    }
  });
};

const WEEKDAYS = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const roundTimeToNearestHalfHour = (dateTime: DateTime) => {
  const minutes = dateTime.minute;
  const roundedMinutes = Math.round(minutes / 30) * 30;
  return dateTime.set({ minute: roundedMinutes });
};

interface PatternData {
  id: string;
  group: string;
  type: string;
  time: number;
  timeFormatted: string;
  dayOfWeek: string;
  date: string;
  count: number;  // Add count for sizing
}

export const PunchCardChart = () => {
  const [selectedYear, setSelectedYear] = useState(() => DateTime.now().year);
  const { data, isLoading } = useTracks(selectedYear);

  // Process data only if we have it
  const patterns = data ? (() => {
    console.log('Raw data:', data);

    const tracksByDay = data.reduce((acc, track) => {
      if (!track.tracked?.lower) return acc;
      const day = track.tracked.lower.startOf('day').toISO();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(track);
      return acc;
    }, {} as Record<string, typeof data>);

    console.log('Grouped by day:', tracksByDay);

    // First group by weekday and time to count occurrences
    const patternGroups = Object.entries(tracksByDay).reduce((acc, [day, tracks]) => {
      if (!tracks?.length) return acc;

      const sortedTracks = tracks.sort((a, b) => 
        a.tracked.lower.toMillis() - b.tracked.lower.toMillis()
      );

      const firstArrival = roundTimeToNearestHalfHour(sortedTracks[0].tracked.lower);
      const lastTrack = sortedTracks[sortedTracks.length - 1];
      const lastDeparture = lastTrack.tracked.upper && roundTimeToNearestHalfHour(lastTrack.tracked.upper);

      if (!lastDeparture) return acc;

      const dayDate = DateTime.fromISO(day);
      const weekday = dayDate.weekdayLong;

      // Create keys for grouping
      const startKey = `${weekday}-${firstArrival.toFormat("HH:mm")}-Start`;
      const endKey = `${weekday}-${lastDeparture.toFormat("HH:mm")}-End`;

      // Initialize or increment counters
      if (!acc[startKey]) {
        acc[startKey] = {
          group: weekday,
          type: "Start",
          time: firstArrival.hour + (firstArrival.minute / 60),
          timeFormatted: firstArrival.toFormat("HH:mm"),
          date: firstArrival.toFormat("d MMM yyyy"),
          dayOfWeek: weekday,
          count: 0,
          dates: [] as string[]
        };
      }
      if (!acc[endKey]) {
        acc[endKey] = {
          group: weekday,
          type: "End",
          time: lastDeparture.hour + (lastDeparture.minute / 60),
          timeFormatted: lastDeparture.toFormat("HH:mm"),
          date: lastDeparture.toFormat("d MMM yyyy"),
          dayOfWeek: weekday,
          count: 0,
          dates: [] as string[]
        };
      }

      acc[startKey].count++;
      acc[endKey].count++;
      acc[startKey].dates.push(dayDate.toFormat("d MMM yyyy"));
      acc[endKey].dates.push(dayDate.toFormat("d MMM yyyy"));

      return acc;
    }, {} as Record<string, Omit<PatternData, 'id'> & { dates: string[] }>);

    return Object.entries(patternGroups).map(([key, data]) => ({
      id: key,
      ...data,
      date: data.dates.join(', ')
    }));
  })() : [];

  // Calculate axis values only if we have patterns
  const { yAxisMin, yAxisMax, tickValues } = patterns.length ? (() => {
    const times = patterns.map(p => p.time);
    const minTime = Math.floor(Math.min(...times));
    const maxTime = Math.ceil(Math.max(...times));
    const yAxisMin = Math.floor(minTime / 2) * 2;
    const yAxisMax = Math.ceil(maxTime / 2) * 2;
    const tickValues = Array.from(
      { length: Math.floor((yAxisMax - yAxisMin) / 2) + 1 }, 
      (_, i) => yAxisMin + (i * 2)
    );
    return { yAxisMin, yAxisMax, tickValues };
  })() : { yAxisMin: 6, yAxisMax: 22, tickValues: Array.from({ length: 9 }, (_, i) => 6 + (i * 2)) };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-gray-200">Work Patterns</h2>
        <div className="flex items-center gap-4">
          <IconButton
            icon={faChevronLeft}
            onClick={() => setSelectedYear(year => year - 1)}
            ariaLabel="Previous year"
            className="text-gray-400 hover:text-gray-300"
          />
          <span className="text-gray-300 text-lg font-medium min-w-[4rem] text-center">
            {selectedYear}
          </span>
          <IconButton
            icon={faChevronRight}
            onClick={() => setSelectedYear(year => year + 1)}
            ariaLabel="Next year"
            disabled={selectedYear >= DateTime.now().year}
            className="text-gray-400 hover:text-gray-300 disabled:text-gray-600 disabled:hover:text-gray-600"
          />
        </div>
      </div>

      <div className="h-96">
        <ResponsiveSwarmPlot
          data={patterns}
          groups={WEEKDAYS}
          value="time"
          valueFormat={value => {
            const hours = Math.floor(value as number);
            const minutes = Math.round((value as number - hours) * 60);
            return DateTime.fromObject({ hour: hours, minute: minutes }).toFormat("HH:mm");
          }}
          valueScale={{ 
            type: "linear", 
            min: yAxisMin,
            max: yAxisMax
          }}
          size={d => Math.max(8, Math.min(24, d.count * 3))}
          forceStrength={12}
          simulationIterations={200}
          spacing={2}
          colors={({ data }) => data.type === "Start" ? colors.green[400] : colors.teal[400]}
          colorBy="type"
          borderColor={{
            from: "color",
            modifiers: [
              ["darker", 0.6],
              ["opacity", 0.5]
            ]
          }}
          margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: value => DateTime.fromObject({ hour: value }).toFormat("HH:mm"),
            tickValues
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: value => DateTime.fromObject({ hour: value }).toFormat("HH:mm"),
            tickValues
          }}
          theme={{
            text: {
              fill: isLoading ? colors.gray[600] : colors.gray[300],
              fontSize: 14
            },
            axis: {
              domain: {
                line: {
                  stroke: colors.stone[700],
                  strokeWidth: 1
                }
              },
              ticks: {
                line: {
                  stroke: colors.stone[700],
                  strokeWidth: 1
                },
                text: {
                  fill: colors.gray[400]
                }
              }
            },
            grid: {
              line: {
                stroke: colors.stone[800],
                strokeWidth: 1
              }
            },
            ...tooltipTheme,
          }}
          tooltip={({ data }: { data: PatternData }) => (
            <Tooltip>
              <div>
                {data.type === "Start" ? (
                  <span className="text-green-400">{data.type}</span>
                ) : (
                  <span className="text-teal-400">{data.type}</span>
                )}
              </div>
              <div>
                {data.timeFormatted} on {data.dayOfWeek}
              </div>
              <div className="text-gray-400">
                {data.count} occurrences
              </div>
            </Tooltip>
          )}
        />
      </div>
    </div>
  );
};
