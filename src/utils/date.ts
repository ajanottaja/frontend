import { Duration } from "luxon";

/**
 * Check if duration is negative
 * @param duration 
 * @returns 
 */
export const isNegativeDuration = (duration: Duration) => duration.toMillis() < 0;

/**
 * Return absolute (i.e. positive) value of duration
 * @param duration 
 * @returns 
 */
export const absDuration = (duration: Duration) => isNegativeDuration(duration) ? duration.negate() : duration;