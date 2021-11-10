import { DateTime, Duration } from "luxon";
import { Interval } from "../api/interval";
import { Step } from "../api/schema";
import { randomInt } from "./functions";

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


/**
 * Given a period returns a function accepting a DateTime as parameter
 * returning all dates within same period.
 * @param period, i.e. day, week, month, or year
 * @returns function
 */
const daysOfPeriod = (period: Step) => (date: DateTime) => {
  const start = date.startOf(period);
  const end = date.endOf(period);
  const dates = [];
  let cursor = start;
  while(cursor < end) {
    dates.push(cursor);
    cursor = cursor.plus({ days: 1});
  }
  return dates;
}

/**
 * Returns length number of intervals on date.
 * @param date
 * @param length
 */
export const intervalsOnDate = (date: DateTime, length: number) => {
  const intervals: Required<Interval>[] = [];
  let previous = date;
  while(intervals.length < length) {
    const beginning = previous.plus({minutes: randomInt(15, 60 * 2)});
    const end = beginning.plus({minutes: randomInt(60, 60 * 8)})
    intervals.push({
      beginning,
      end,
    });
    previous = end;
  }

  return intervals;
}

/**
 * Given date returns all dates in same calendar year
 * @param date
 * @returns list of DateTime
 */
export const daysOfYear = daysOfPeriod("year");

/**
 * Given date returns all dates in same calendar year
 * @param date
 * @returns list of DateTime
 */
export const daysOfMonth = daysOfPeriod("month");

/**
 * Given date returns all dates in same calendar year
 * @param date
 * @returns list of DateTime
 */
export const daysOfWeek = daysOfPeriod("week");


export const quartersOfDay = () => {
  const start = DateTime.now().startOf("day");
  const end = DateTime.now().endOf("day");
  const dates = [];
  let cursor = start;
  while(cursor < end) {
    dates.push(cursor);
    cursor = cursor.plus({ days: 1});
  }
  return dates;
}

/**
 * Finds date for previous day, week, month, or year.
 * Will normalize to first date, i.e. first day of week, month, or year.
 * @param unit day, week, month or year
 * @param date the date from which to calculate previous date
 * @returns 
 */
export const previous = (unit: Step, date: DateTime) => {
  const start = date.startOf(unit);
  switch(unit) {
    case "day":
      return start.set({day: start.day - 1});
    case "week":
      return start.set({day: start.day - 7});
    case "month":
      return start.set({month: start.month - 1});
    case "year":
      return start.set({year: start.year - 1});
  }
}


/**
 * Finds date for next day, week, month, or year.
 * Will normalize to first date, i.e. first day of week, month, or year.
 * @param unit day, week, month or year
 * @param date the date from which to calculate next date
 * @returns 
 */
export const next = (unit: Step, date: DateTime) => {
  const start = date.startOf(unit);
  switch(unit) {
    case "day":
      return start.set({day: start.day + 1});
    case "week":
      return start.set({day: start.day + 7});
    case "month":
      return start.set({month: start.month + 1});
    case "year":
      return start.set({year: start.year + 1});
  }
}

/**
 * Get date of current day, week, month, or year
 * @param unit day, week, month, or year
 * @returns date for current unit
 */
export const current = (unit: Step) => DateTime.now().startOf(unit);




export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"];