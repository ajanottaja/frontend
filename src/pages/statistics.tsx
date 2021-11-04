import React, { Suspense } from "react";
import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import { DateTime } from "luxon";
import { CalendarDatum, ResponsiveCalendarCanvas } from "@nivo/calendar";
import { Datum, ResponsiveLineCanvas, Serie } from "@nivo/line";
import { colors } from "windicss/config";

import {
  useCumulativeStatistics,
  useStatisticsCalendar,
  useStatisticsSummary,
} from "../api/statistics";
import Loading from "../components/layout/loading-page";
import { scaleLinear } from "d3-scale";
import { DatumValue } from "@nivo/core";

const colorScale = [
  "#7f1d1d",
  "#8f3c36",
  "#9d5850",
  "#aa736c",
  "#b58f89",
  "#bfaaa7",
  "#c6c6c6",
  "#a9b2ab",
  "#8b9f90",
  "#6f8b76",
  "#52785c",
  "#366644",
  "#14532d",
];

const StatisticsCalendar = ({
  auth0,
}: {
  auth0: Auth0ContextInterface<User>;
}) => {
  const { data, error, mutate } = useStatisticsCalendar(auth0);
  let calendarData: CalendarDatum[] = [];
  if (data?.status === 200) {
    calendarData = data.body
      .sort((a, b) => a.date.diff(b.date).milliseconds)
      .map(({ date, diff }) => ({
        day: date.toISODate(),
        value: diff.as("hours"),
      }));
  }

  return (
    <div w="full max-screen-lg" p="x-8" h="64">
      <h2 text="gray-300">Tracked time vs target in hours</h2>
      <ResponsiveCalendarCanvas
        data={calendarData}
        from={DateTime.now().startOf("year").toJSDate()}
        to={DateTime.now().endOf("year").toJSDate()}
        minValue={-2}
        maxValue={2}
        emptyColor={colors.dark[500]}
        theme={{
          textColor: colors.gray[300],
          fontSize: 14,
        }}
        colors={colorScale}
        margin={{ top: 0, right: 0, bottom: 20 }}
        yearSpacing={0}
        monthBorderColor="#ffffff"
        dayBorderWidth={1}
        dayBorderColor={colors.dark[800]}
        legends={[
          {
            anchor: "bottom-right",
            direction: "row",
            translateY: 5,
            itemCount: 5,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: "right-to-left",
          },
        ]}
      />
    </div>
  );
};

const CumulativeStatistics = ({
  auth0,
}: {
  auth0: Auth0ContextInterface<User>;
}) => {
  const { data, error, mutate } = useCumulativeStatistics(auth0);
  let calendarData: Datum[] = [];
  let max = 0;
  let min = 0;
  if (data?.status === 200) {
    calendarData = data.body.map(({ date, cumulativeDiff }) => ({
      x: date.toSeconds(),
      y: cumulativeDiff.as("hours"),
    }));
    max = Math.max(...data.body.map((d) => d.cumulativeDiff.as("hours")));
    min = Math.min(...data.body.map((d) => d.cumulativeDiff.as("hours")));
  }

  const ticks = scaleLinear()
    .domain([min, max])
    .ticks(5);

  const lineData: Serie[] = [
    { id: "Cumulative difference", data: calendarData },
  ];

  return (
    <div w="full max-screen-lg" p="x-8" h="64">
      <h2 text="gray-300">Tracked time vs target in hours</h2>
      <ResponsiveLineCanvas
        data={lineData}
        margin={{ top: 60, left: 60, right: 60, bottom: 60 }}
        xScale={{ type: "linear", min: "auto", max: "auto" }}
        yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
        yFormat=" >-.2f"
        xFormat={(v: DatumValue) => DateTime.fromSeconds(v as number).toFormat("yyyy-MM-dd")}
        colors={[colors.green[800]]}
        theme={{
          textColor: colors.gray[300],
          fontSize: 14,
        
        }}
        curve="monotoneX"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (v) => DateTime.fromSeconds(v).toFormat("dd.MM"),
          legend: "Date",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickValues: ticks,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: ".2s",
          legend: "Hours",
          legendOffset: -40,
          legendPosition: "middle",
        }}

        gridYValues={ticks}
        enableGridX={false}
        lineWidth={4}
        pointSize={4}
        pointColor={{ theme: "background" }}
        pointBorderWidth={4}
        pointBorderColor={{ from: "serieColor" }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "row",
            translateY: 60,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: "right-to-left",
          },
        ]}
        
      />
    </div>
  );
};

const Statistics = () => {
  const auth0 = useAuth0();

  if (auth0.isLoading) {
    return <Loading />;
  }

  if (auth0.error) {
    return <div>Authentication error</div>;
  }

  if (!auth0.isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div
      w="full"
      display="flex"
      flex="col"
      justify="center"
      align="items-center"
      h="full"
      m="<sm:t-8"
    >
      <div
        w="full"
        justify="self-center items-center"
        align="self-center items-center"
        display="grid"
        grid="cols-1 <lg:cols-1 lg:gap-x-32 <lg:gap-y-8"
        p="<lg:x-4"
      >
        <Suspense fallback={<Loading />}>
          <StatisticsCalendar auth0={auth0} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <CumulativeStatistics auth0={auth0} />
        </Suspense>
      </div>
    </div>
  );
};

export default Statistics;
