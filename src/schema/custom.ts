import { z } from "zod";
import { DateTime, Duration, Interval } from "luxon";

// Validate and transform ISO8601 durations to Luxon durations
export const iso8601ToDuration = z
  .string()
  .refine((v) => Duration.fromISO(v).isValid)
  .transform((v) => Duration.fromISO(v));


// Validate and transform ISO8601 dates to Luxon DateTime
export const iso8601ToDateTime = z
  .string()
  .refine((v) => DateTime.fromISO(v).isValid)
  .transform((v) => DateTime.fromISO(v));

// Validate and transform Luxon durations to ISO8601 durations
export const durationToIso8601 = z
  .instanceof(Duration)
  .refine((v) => v.isValid)
  .transform((v) => v.toISO());

// Validate and transform Luxon DateTime to ISO8601 dates
export const dateTimeToIso8601 = z
  .instanceof(DateTime)
  .refine((v) => v.isValid)
  .transform((v) => v.toISO());

export const tsRangeJson = z
  .object({
    lower: iso8601ToDateTime,
    upper: iso8601ToDateTime.nullable().optional(),
    lowerInclusive: z.boolean(),
    upperInclusive: z.boolean(),
  });