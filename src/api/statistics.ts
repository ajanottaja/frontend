import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Duration } from "luxon";
import { type, Infer, union, literal, array, enums } from "superstruct";
import { PublicConfiguration } from "swr/dist/types";
import { apiHost } from "../config";
import { useSwrWithAuth0 } from "./fetch";
import {
  defaultedNull,
  InternalServerErrorSchema,
  LuxonDateTime,
  LuxonDuration,
} from "./schema";

const SummarySchema = type({
  unit: enums(["day", "week", "month", "all"]),
  target: LuxonDuration,
  tracked: LuxonDuration,
  diff: LuxonDuration,
});

export type StatisticsSummary = Infer<typeof SummarySchema>;

const StatisticsSummarySchema = type({
  status: literal(200),
  body: array(SummarySchema),
});

const StatisticsSummaryResponseSchema = union([
  StatisticsSummarySchema,
  InternalServerErrorSchema,
]);
type StatisticsSummaryResponse = Infer<typeof StatisticsSummaryResponseSchema>;

export const useStatisticsSummary = (
  auth0: Auth0ContextInterface<User>,
  swrOpts: Partial<PublicConfiguration> | undefined = {}
) => {
  return useSwrWithAuth0<
    undefined,
    undefined,
    undefined,
    StatisticsSummaryResponse
  >(
    {
      url: `${apiHost}/statistics/summary`,
      auth0,
      responseSchema: StatisticsSummaryResponseSchema,
    },
    swrOpts
  );
};

const CalendarStatisticSchema = type({
  date: LuxonDateTime,
  target: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
  tracked: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
  diff: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
});

export type CalendarStatistic = Infer<typeof CalendarStatisticSchema>;

const StatisticsCalendarSchema = type({
  status: literal(200),
  body: array(CalendarStatisticSchema),
});

type StatisticsCalendar = Infer<typeof StatisticsCalendarSchema>;

const StatisticsCalendarResponseSchema = union([
  StatisticsCalendarSchema,
  InternalServerErrorSchema,
]);
type StatisticsCalendarResponse = Infer<typeof StatisticsCalendarResponseSchema>;

export const useStatisticsCalendar = (
  auth0: Auth0ContextInterface<User>,
  swrOpts: Partial<PublicConfiguration> | undefined = {}
) => {
  return useSwrWithAuth0<
    undefined,
    undefined,
    undefined,
    StatisticsCalendarResponse
  >(
    {
      url: `${apiHost}/statistics/calendar`,
      auth0,
      responseSchema: StatisticsCalendarResponseSchema,
    },
    swrOpts
  );
};




const CumulativeStatisticSchema = type({
  date: LuxonDateTime,
  target: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
  tracked: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
  diff: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
  cumulativeDiff: defaultedNull(LuxonDuration, Duration.fromMillis(0)),
});

export type CumulativeStatistic = Infer<typeof CumulativeStatisticSchema>;

const CumulativeStatisticsSchema = type({
  status: literal(200),
  body: array(CumulativeStatisticSchema),
});

const CumulativeStatisticsResponseSchema = union([
  CumulativeStatisticsSchema,
  InternalServerErrorSchema,
]);
type CumulativeStatisticsResponse = Infer<typeof CumulativeStatisticsResponseSchema>;

export const useCumulativeStatistics = (
  auth0: Auth0ContextInterface<User>,
  swrOpts: Partial<PublicConfiguration> | undefined = {}
) => {
  return useSwrWithAuth0<
    undefined,
    undefined,
    undefined,
    CumulativeStatisticsResponse
  >(
    {
      url: `${apiHost}/statistics/cumulative`,
      auth0,
      responseSchema: CumulativeStatisticsResponseSchema,
    },
    swrOpts
  );
};
