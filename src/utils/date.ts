import { DateTime, Duration } from "luxon";

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

export const daysOfMonth = (date: DateTime) => {
  const start = date.startOf("month");
  const end = date.endOf("month");
  const dates = [];
  let cursor = start;
  while(cursor < end) {
    dates.push(cursor);
    cursor = cursor.plus({ days: 1});
  }

  return dates;
}