import { DateTime, Duration } from "luxon";
import { coerce, define, string } from "superstruct";

/**
 * Parse ISO dates as a Luxon DateTime object
 */
export const IsoDateTime = coerce(
  define<DateTime>('IsoDateTime', DateTime.isDateTime),
  string(),
  (value) => DateTime.fromISO(value)
);

/**
 * Parse ISO Durations (e.g. PT1H30M) as Luxon Duration object
 */
export const IsoDuration = coerce(
  define<Duration>('IsoDuration', Duration.isDuration),
  string(),
  (value) => Duration.fromISO(value)
);

