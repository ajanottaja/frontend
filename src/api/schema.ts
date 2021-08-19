import { DateTime, Duration } from "luxon";
import { coerce, define, string } from "superstruct";

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
  (value: DateTime) => value.toISO()
);

/**
 * Parse ISO Durations (e.g. PT1H30M) as Luxon Duration object
 */
export const IsoDuration = coerce(
  define<Duration>('IsoDuration', v => typeof v === "string"),
  LuxonDuration,
  (value: Duration) => value.toISO()
);

