import React, { Suspense, useState, useEffect } from "react";
import { DateTime, Duration } from "luxon";
import { CalendarDatum, ResponsiveCalendarCanvas } from "@nivo/calendar";
import { Datum, ResponsiveLineCanvas, Serie } from "@nivo/line";
import colors from "tailwindcss/colors";
import { scaleLinear } from "d3-scale";
import { DatumValue } from "@nivo/core";
import { useClient } from "../supabase/use-client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Button, IconButton } from "../components/atoms/button";
import { interpolateRgb } from "d3-interpolate";
import { PunchCardChart } from "../components/organisms/punch-card-chart";
import { tooltipTheme } from "../components/atoms/tooltip";

import {
  dateTimeToIso8601,
  durationToIso8601,
  iso8601ToDateTime,
  iso8601ToDuration,
} from "../schema/custom";

// Create color interpolation functions using the RGB values directly
const negativeColorScale = scaleLinear<string>()
  .domain([-2, 0])
  .range([
    'rgb(239, 68, 68)',  // Same as rose-500 in RGB
    'rgb(41, 37, 36)'    // Same as stone-800 in RGB
  ])
  .interpolate(interpolateRgb.gamma(2.2));

const positiveColorScale = scaleLinear<string>()
  .domain([0, 2])
  .range([
    'rgb(41, 37, 36)',    // Same as stone-800 in RGB
    'rgb(34, 197, 94)'    // Same as emerald-500 in RGB
  ])
  .interpolate(interpolateRgb.gamma(2.2));

// Generate and log the full color scale
const colorScale = Array.from({ length: 11 }, (_, i) => {
  const value = -2 + (i * 0.4);
  return value <= 0 
    ? negativeColorScale(value)
    : positiveColorScale(value);
});

const statisticsCalendarSchema = z.object({
  date: iso8601ToDateTime,
  target: iso8601ToDuration,
  tracked: iso8601ToDuration,
  diff: iso8601ToDuration,
});

const statsParamsSchema = z
  .object({
    dateStart: dateTimeToIso8601,
    duration: durationToIso8601,
    step: durationToIso8601,
  })
  .transform(({ dateStart, duration, step }) => ({
    date_start: dateStart,
    duration,
    step,
  }));

const useStatisticsCalendar = (params: z.input<typeof statsParamsSchema>) => {
  const client = useClient();
  // Call supabase rpc calendar function to get calendar rows
  return useQuery({
    queryKey: ["statistics-calendar", params.dateStart.toISO()],
    enabled: false,
    queryFn: async () => {
      const statsParams = statsParamsSchema.parse(params);
      const { data, error } = await client
      .rpc("stats", statsParams)
      .select("date,target::json,tracked::json,diff::json");
      if (error) throw error;
      return z.array(statisticsCalendarSchema).parse(data);
    },
  });
};

const StatisticsCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(() => DateTime.now().year);
  
  const { data, error, isLoading, refetch } = useStatisticsCalendar({
    dateStart: DateTime.fromObject({ year: selectedYear }).startOf("year"),
    duration: Duration.fromObject({ days: 364 }),
    step: Duration.fromObject({ days: 1 }),
  });

  // Fetch data when year changes
  useEffect(() => {
    refetch();
  }, [selectedYear, refetch]);

  // Always render the calendar structure, just with empty data if loading or error
  const calendarData: CalendarDatum[] = (!isLoading && !error && data) 
    ? data
        .sort((a, b) => a.date.diff(b.date).milliseconds)
        .map(({ date, diff }) => ({
          day: date.toISODate(),
          value: diff.as("hours"),
        }))
    : [{
      day: DateTime.fromObject({ year: selectedYear, month: 1, day: 1 }).toISODate(),
      value: 0
    }];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-gray-200">Daily Progress</h2>
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
      <div className="h-72">
        <ResponsiveCalendarCanvas
          data={calendarData}
          from={DateTime.fromObject({ year: selectedYear }).startOf("year").toJSDate()}
          to={DateTime.fromObject({ year: selectedYear }).endOf("year").toJSDate()}
          minValue={-2}
          maxValue={2}
          emptyColor={colors.stone[800]}
          theme={{
            text: {
              fill: isLoading ? colors.gray[600] : colors.gray[300],
              fontSize: 14,
            },
            ...tooltipTheme,
          }}
          colors={colorScale}
          margin={{ top: 30, right: 40, bottom: 100, left: 40 }}
          monthBorderColor={colors.stone[800]}
          dayBorderWidth={2}
          dayBorderColor={colors.stone[900]}
          valueFormat=">-.2f"
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 80,
              itemCount: 11,
              itemWidth: 40,
              itemHeight: 20,
              itemsSpacing: 10,
              itemDirection: "right-to-left",
              symbolSize: 14,
              symbolShape: "square",
              itemTextColor: colors.gray[300],
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: colors.gray[100],
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

const cumulativeStatisticsSchema = z
  .object({
    date: iso8601ToDateTime,
    target: iso8601ToDuration,
    tracked: iso8601ToDuration,
    diff: iso8601ToDuration,
    cumulative_diff: iso8601ToDuration,
  })
  .transform(({ date, target, tracked, diff, cumulative_diff }) => ({
    date,
    target,
    tracked,
    diff,
    cumulativeDiff: cumulative_diff,
  }));

const cumulativeStatsFilterSchema = z.object({
  date: dateTimeToIso8601,
});

const useAccumulatedStatistics = (
  filter: z.input<typeof cumulativeStatsFilterSchema>
) => {
  const client = useClient();
  // Call supabase rpc calendar function to get calendar rows
  return useQuery({
    queryKey: ["accumulated-stats"],
    queryFn: async () => {
      const queryFilter = cumulativeStatsFilterSchema.parse(filter);
      const { data, error } = await client
        .from("accumulated_stats")
      .select(
        "date,target::json,tracked::json,diff::json,cumulative_diff::json"
      )
      .filter("date", "lte", filter.date)
      .order("date", { ascending: true });
    if (error) throw error;
      return z.array(cumulativeStatisticsSchema).parse(data);
    },
  });
};

// Add this type above the CumulativeStatistics component
type TimeRange = 'week' | 'month' | 'year';

const CumulativeStatistics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedDate, setSelectedDate] = useState(() => DateTime.now());

  // Calculate date range based on selected time range
  const dateRange = {
    start: selectedDate.startOf(timeRange),
    end: selectedDate.endOf(timeRange)
  };

  const { data, isLoading } = useAccumulatedStatistics({ 
    date: dateRange.end
  });

  let calendarData: Datum[] = [];
  let max = 0;
  let min = 0;

  if (data) {
    // Filter data to selected time range
    const filteredData = data.filter(d => 
      d.date >= dateRange.start && d.date <= dateRange.end
    );

    calendarData = filteredData.map(({ date, cumulativeDiff }) => ({
      x: date.toSeconds(),
      y: cumulativeDiff.as("hours"),
    }));
    max = Math.max(...filteredData.map((d) => d.cumulativeDiff.as("hours")));
    min = Math.min(...filteredData.map((d) => d.cumulativeDiff.as("hours")));
  }

  const ticks = scaleLinear().domain([min, max]).ticks(5);
  const lineData: Serie[] = [{ id: "Cumulative difference", data: calendarData }];

  // Format the current time range for display
  const timeRangeDisplay = {
    week: selectedDate.toFormat("'Week' W, yyyy"),
    month: selectedDate.toFormat('MMMM yyyy'),
    year: selectedDate.toFormat('yyyy')
  }[timeRange];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-gray-200">Cumulative Progress</h2>
        <div className="flex items-center gap-8">
          {/* Time range selector */}
          <div className="flex items-center gap-4 text-sm">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-stone-800 text-gray-200'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Navigation controls */}
          <div className="flex items-center gap-4">
            <IconButton
              icon={faChevronLeft}
              onClick={() => setSelectedDate(d => d.minus({ [timeRange]: 1 }))}
              ariaLabel={`Previous ${timeRange}`}
              className="text-gray-400 hover:text-gray-300"
            />
            <span className="text-gray-300 text-lg font-medium min-w-[8rem] text-center">
              {timeRangeDisplay}
            </span>
            <IconButton
              icon={faChevronRight}
              onClick={() => setSelectedDate(d => d.plus({ [timeRange]: 1 }))}
              ariaLabel={`Next ${timeRange}`}
              disabled={selectedDate.endOf(timeRange) >= DateTime.now()}
              className="text-gray-400 hover:text-gray-300 disabled:text-gray-600 disabled:hover:text-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveLineCanvas
          data={lineData}
          margin={{ top: 20, right: 40, left: 80, bottom: 100 }}
          xScale={{ 
            type: "linear",
            min: dateRange.start.toSeconds(),
            max: dateRange.end.toSeconds()
          }}
          yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
          yFormat=" >-.0f"
          xFormat={(v: DatumValue) => {
            const timestamp = typeof v === 'number' ? v : parseFloat(v as string);
            return DateTime.fromSeconds(timestamp).toFormat("ccc d.M.yyyy");
          }}
          colors={[colors.green[400]]}
          theme={{
            text: {
              fill: isLoading ? colors.gray[600] : colors.gray[300],
              fontSize: 14,
            },
            ...tooltipTheme,
            axis: {
              domain: {
                line: {
                  stroke: colors.stone[700],
                  strokeWidth: 1,
                },
              },
              ticks: {
                line: {
                  stroke: colors.stone[700],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.gray[400],
                },
              },
              legend: {
                text: {
                  fill: colors.gray[300],
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: colors.stone[800],
                strokeWidth: 1,
              },
            },
          }}
          curve="monotoneX"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: (v) => {
              const timestamp = typeof v === 'number' ? v : parseFloat(v as string);
              return DateTime.fromSeconds(timestamp).toFormat(
                timeRange === 'week' ? 'ccc' :
                timeRange === 'month' ? 'd' : 'MMM'
              );
            },
            tickValues: timeRange === 'week' ? 7 : 
                        timeRange === 'month' ? 31 : 12,
            legend: "Date",
            legendOffset: 60,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickValues: ticks,
            tickSize: 5,
            tickPadding: 8,
            tickRotation: 0,
            format: ",.0f",
            legend: "Hours",
            legendOffset: -60,
            legendPosition: "middle",
          }}
          gridYValues={ticks}
          enableGridX={false}
          lineWidth={2}
          pointSize={4}
          pointColor={colors.stone[900]}
          pointBorderWidth={2}
          pointBorderColor={colors.green[400]}
          enablePoints={false}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateY: 90,
              itemWidth: 200,
              itemHeight: 20,
              itemsSpacing: 10,
              symbolSize: 16,
              symbolShape: "circle",
              itemDirection: "left-to-right",
              itemTextColor: colors.gray[300],
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: colors.gray[100],
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

const Statistics = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <h1 className="sr-only">Statistics</h1>
      <div className="space-y-24">
        <Suspense fallback={<StatisticsCalendar />}>
          <StatisticsCalendar />
        </Suspense>
        <Suspense>
          <CumulativeStatistics />
        </Suspense>
        <Suspense>
          <PunchCardChart />
        </Suspense>
      </div>
    </div>
  );
};

export default Statistics;
