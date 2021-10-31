import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, string, date, Infer, union, literal, array, enums, optional, nullable } from "superstruct";
import { PublicConfiguration } from "swr/dist/types";
import { apiHost } from "../config";
import { httpPost, useSwrWithAuth0 } from "./fetch";
import { IntervalSchema } from "./interval";
import { InternalServerErrorSchema, IsoDate, LuxonDateTime, LuxonDuration, StepSchema } from "./schema";

const IntervalRecordSchema = type({
  id: string(),
  interval: IntervalSchema,
});

export type IntervalRecord = Infer<typeof IntervalRecordSchema>;


const TargetRecordSchema = type({
  id: string(),
  duration: LuxonDuration,
  date: LuxonDateTime,
});

export type TargetRecord = Infer<typeof TargetRecordSchema>;

const DateSchema = type({
  date: LuxonDateTime,
  target: nullable(TargetRecordSchema),
  intervals: array(IntervalRecordSchema)
});

export type CalendarDate = Infer<typeof DateSchema>;

const CalendarSchema = type({
  status: literal(200),
  body: array(DateSchema)
});

const CalendarResponseSchema = union([CalendarSchema, InternalServerErrorSchema]);
type CalendarResponse = Infer<typeof CalendarResponseSchema>;


const CalendarParamsSchema = type({
  date: IsoDate,
  step: StepSchema
});

type CalendarParams = Infer<typeof CalendarParamsSchema>;

interface UseCalendar {
  auth0: Auth0ContextInterface<User>;
  swrOpts?: Partial<PublicConfiguration>;
  query: CalendarParams;
}

export const useCalendar = ({query, auth0, swrOpts = {}}: UseCalendar) => {
  return useSwrWithAuth0<undefined, CalendarParams, undefined, CalendarResponse>({ 
    url: `${apiHost}/calendar`,
    query: {value: query, schema: CalendarParamsSchema},
    auth0,
    responseSchema: CalendarResponseSchema }, swrOpts);
}