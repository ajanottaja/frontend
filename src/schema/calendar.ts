import { z } from "zod";
import { DateTime, Duration } from "luxon";
import { dateTimeToIso8601, dateTimeToIso8601Date, iso8601ToDateTime, iso8601ToDuration, tsRangeToObject } from "./custom";

export const calendarDurationSchema = z.enum(["day", "week", "month", "year"]);

export type CalendarDuration = z.infer<typeof calendarDurationSchema>;

export const trackSchema = z.object({
  id: z.string().uuid(),
  tracked: tsRangeToObject,
});

export type Track = z.infer<typeof trackSchema>;

export const targetSchema = z.object({
  id: z.string().uuid(),
  date: iso8601ToDateTime,
  duration: iso8601ToDuration,
});

export type Target = z.infer<typeof targetSchema>;

export const calendarDateSchema = z.object({
  date: iso8601ToDateTime,
  tracks: z.array(trackSchema),
  target: targetSchema.optional().nullable(),
});

export type CalendarDate = z.infer<typeof calendarDateSchema>;

export const calendarParamsSchema = z.object({
  startDate: dateTimeToIso8601Date,
  duration: calendarDurationSchema,
});

export type CalendarParams = z.infer<typeof calendarParamsSchema>;

export const calendarQuerySchema = z.object({
  startDate: iso8601ToDateTime.default(() => DateTime.now().startOf("month").toISODate()),
  duration: calendarDurationSchema.default("month"),
});

export type CalendarQuery = z.infer<typeof calendarQuerySchema>;