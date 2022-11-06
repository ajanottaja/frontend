import { z } from "zod";
import { DateTime, Duration } from "luxon";

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
  .custom<Duration>((v) => v instanceof Duration)
  .refine((v) => v.isValid)
  .transform((v) => v.toISO());

// Validate and transform Luxon DateTime to ISO8601 dates
export const dateTimeToIso8601 = z
  .custom<DateTime>((v) => v instanceof DateTime)
  .refine((v) => v.isValid)
  .transform((v) => v.toISO());

// Validate and transform Luxon DateTime to ISO8601 date only
export const dateTimeToIso8601Date = z
  .custom<DateTime>((v) => v instanceof DateTime)
  .refine((v) => v.isValid)
  .transform((v) => v.toISODate());

export const dateTimeToSql = z
  .custom<DateTime>((v) => v instanceof DateTime)
  .refine((v) => v.isValid)
  .transform((v) => v.toSQL({ includeOffsetSpace: false }));

export const tsRangeToObject = z.object({
  lower: iso8601ToDateTime,
  upper: iso8601ToDateTime.nullable().optional(),
  lowerInclusive: z.boolean().optional().default(true),
  upperInclusive: z.boolean().optional().default(false),
});

export const tsRangeObjectToString = z
  .object({
    lower: dateTimeToSql.nullable().optional(),
    upper: dateTimeToSql.nullable().optional(),
    lowerInclusive: z
      .boolean()
      .optional()
      .default(true)
      .transform((v) => (v ? "[" : "(")),
    upperInclusive: z
      .boolean()
      .optional()
      .default(false)
      .transform((v) => (v ? "]" : ")")),
  })
  .transform((v) => {
    const { lower, upper, lowerInclusive, upperInclusive } = v;
    return `${lowerInclusive}${lower || ""},${upper || ""}${upperInclusive}`;
  });
