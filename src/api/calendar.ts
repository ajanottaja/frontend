import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, string, date, Infer, union, literal, array, enums, optional, nullable } from "superstruct";
import { Configuration } from "swr/dist/types";
import { apiHost } from "../config";
import { httpPost, useSwrWithAuth0 } from "./fetch";
import { InternalServerErrorSchema, Interval, IsoDate, LuxonDateTime, LuxonDuration, StepSchema } from "./schema";

const DateSchema = type({
  date: LuxonDateTime,
  target: nullable(LuxonDuration),
  intervals: array(Interval)
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
  swrOpts?: Partial<Configuration>;
  params: CalendarParams;
}

export const useCalendar = ({params, auth0, swrOpts = {}}: UseCalendar) => {
  return useSwrWithAuth0<CalendarParams, CalendarResponse>({ 
    url: `${apiHost}/calendar`,
    params,
    auth0,
    requestSchema: CalendarParamsSchema,
    responseSchema: CalendarResponseSchema }, swrOpts);
}