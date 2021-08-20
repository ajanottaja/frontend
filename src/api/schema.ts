import { DateTime, Duration } from "luxon";
import { defaulted, coerce, define, literal, number, string, type } from "superstruct";

/**
 * Validate and coerce ISO Date strings as a Luxon DateTime object
 */
export const LuxonDateTime = coerce(
  define<DateTime>('LuxonDateTime', DateTime.isDateTime),
  string(),
  (value) => DateTime.fromISO(value)
);

/**
 * Validate and coerce ISO Duration strings (e.g. PT1H30M) as Luxon Duration object
 */
export const LuxonDuration = coerce(
  define<Duration>('LuxonDuration', Duration.isDuration),
  string(),
  (value) => Duration.fromISO(value)
);


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

export const NotFoundSchema = type({
  status: literal(404),
  body: type({
    status: literal(404),
    message: string()
  })
});


export const InternalServerErrorSchema = type({
  status: literal(500),
  body: type({
    status: defaulted(literal(500), 500),
    message: string()
  })
});


export const ErrorSchemas = [NotFoundSchema, InternalServerErrorSchema];