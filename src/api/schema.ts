import { DateTime, Duration } from "luxon";
import { coerce, define, literal, string, type, nullable, enums, Infer } from "superstruct";

const isDateTime = (value: unknown) => {
  return DateTime.isDateTime(value as object);
}

const isDuration = (value: unknown) => {
  return Duration.isDuration(value as object);
}

/**
 * Validate and coerce ISO Date strings as a Luxon DateTime object
 */
export const LuxonDateTime = coerce(
  define<DateTime>('LuxonDateTime', isDateTime),
  string(),
  (value) => DateTime.fromISO(value)
);

/**
 * Validate and coerce ISO Duration strings (e.g. PT1H30M) as Luxon Duration object
 */
export const LuxonDuration = coerce(
  define<Duration>('LuxonDuration', isDuration),
  string(),
  (value) => Duration.fromISO(value)
);

/**
 * Validate and coerce Interval map of beginning and end date times
 */
export const Interval = type({
  beginning: LuxonDateTime,
  end: nullable(LuxonDateTime)
});

/**
 * Validate and coerce Luxon DateTimes as ISO Date strings
 */
 export const IsoDateTime = coerce(
  define<DateTime>('IsoDateTime', v => typeof v === "string"),
  LuxonDateTime,
  (value: DateTime) => value.toISO({})
);

/**
 * Validate and coerce Luxon DateTimes as ISO Date strings (without time part)
 */
 export const IsoDate = coerce(
  define<DateTime>('IsoDate', v => typeof v === "string"),
  LuxonDateTime,
  (value: DateTime) => value.toISO({}).split("T")[0]
);

/**
 * Parse ISO Durations (e.g. PT1H30M) as Luxon Duration object
 */
export const IsoDuration = coerce(
  define<Duration>('IsoDuration', v => typeof v === "string"),
  LuxonDuration,
  (value: Duration) => value.toISO()
);


export const StepsSchema = enums(["day", "week", "month", "year"]);
export type Steps = Infer<typeof StepsSchema>;

/**
 * 404 responses
 */
export const NotFoundSchema = type({
  status: literal(404),
  body: type({
    message: string()
  })
});


export const InternalServerErrorSchema = type({
  status: literal(500),
  body: type({
    message: string()
  })
});


export const ErrorSchemas = [NotFoundSchema, InternalServerErrorSchema];