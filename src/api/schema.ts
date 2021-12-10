import { DateTime, Duration } from "luxon";
import { coerce, define, literal, string, type, nullable, enums, Infer, Struct, unknown } from "superstruct";

/**
 * Given object checks if value is a plain javascript object 
 * @returns bool
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    return Object.getPrototypeOf(value) === Object.prototype;
};

/**
 * Same as superstruct's defaulted, but also defaults if value is null.
 * Accepts the same parameters.
 * @param struct
 * @param fallback
 * @param options
 * @returns
 */
export const defaultedNull = <T, S>(
  struct: Struct<T, S>,
  fallback: any,
  options: {
    strict?: boolean
  } = {}
): Struct<T, S> => {
  return coerce(struct, unknown(), (x) => {
    const f = typeof fallback === 'function' ? fallback() : fallback

    if (x === undefined || x === null) {
      return f
    }

    if (!options.strict && isPlainObject(x) && isPlainObject(f)) {
      const ret = { ...x }
      let changed = false

      // eslint-disable-next-line no-restricted-syntax
      for (const key in f) {
        if (ret[key] === undefined || ret[key] === null) {
          ret[key] = f[key]
          changed = true
        }
      }

      if (changed) {
        return ret
      }
    }

    return x
  })
}

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
export const IntervalSchema = type({
  beginning: LuxonDateTime,
  end: nullable(LuxonDateTime)
});


export type Interval = Infer<typeof IntervalSchema>;


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

export const Uuid = define<string>('Uuid', v => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v as string));

export const StepSchema = enums(["day", "week", "month", "year"]);
export type Step = Infer<typeof StepSchema>;



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