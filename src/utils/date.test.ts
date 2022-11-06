import { DateTime, Duration } from "luxon";
import {
  daysOfMonth,
  absDuration,
  isNegativeDuration,
  daysOfWeek,
  daysOfYear,
  previous,
  next,
} from "./date";

describe("daysOfMonth", () => {
  test("Returns a list of all dates in same month as supplied date", () => {
    const dates = daysOfMonth(DateTime.fromISO("2021-08-23"));
    expect(dates.length).toBe(31);
    expect(dates[0].day).toBe(1);
    expect(dates).toSatisfyAll((d: DateTime) => d.month === 8);
    expect(dates[30].day).toBe(31);
  });
});

describe("daysOfWeek", () => {
  test("Returns a list of all dates in same week as supplied date", () => {
    const dates = daysOfWeek(DateTime.fromISO("2021-08-23"));
    expect(dates.length).toBe(7);
    expect(dates[0].day).toBe(23);
    expect(dates[6].day).toBe(29);
    expect(dates).toSatisfyAll((d: DateTime) => d.weekNumber === 34);
  });
});

describe("daysOfYear", () => {
  test("Returns a list of all dates in same year as supplied date", () => {
    const dates = daysOfYear(DateTime.fromISO("2021-08-23"));
    expect(dates.length).toBe(365);
    expect(dates[0].day).toBe(1);
    expect(dates[0].month).toBe(1);
    expect(dates[364].day).toBe(31);
    expect(dates[364].month).toBe(12);
    expect(dates).toSatisfyAll((d: DateTime) => d.year === 2021);
  });
});

describe("absDuration", () => {
  test("Returns positive duration for already positive duration", () => {
    const abs = absDuration(Duration.fromISO("PT2S")).toMillis();
    expect(abs).toBe(2000);
  });

  test("Returns positive duration for negative duration", () => {
    const abs = absDuration(Duration.fromISO("PT-2S")).toMillis();
    expect(abs).toBe(2000);
  });
});

describe("isNegativeDuration", () => {
  test("Returns true if duration negative", () => {
    expect(isNegativeDuration(Duration.fromISO("PT-2S"))).toBeTruthy();
  });
  test("Returns false if duration positive", () => {
    expect(isNegativeDuration(Duration.fromISO("PT2S"))).toBeFalsy();
  });
});

describe("previous (day, week, month, year)", () => {
  test("Returns previous day", () => {
    expect(previous("day", DateTime.fromISO("2021-08-23"))?.toISODate()).toBe(
      "2021-08-22"
    );
    expect(previous("day", DateTime.fromISO("2021-08-01"))?.toISODate()).toBe(
      "2021-07-31"
    );
    expect(previous("day", DateTime.fromISO("2021-01-01"))?.toISODate()).toBe(
      "2020-12-31"
    );
  });
  test("Returns previous week", () => {
    expect(previous("week", DateTime.fromISO("2021-08-23"))?.toISODate()).toBe(
      "2021-08-16"
    );
    expect(previous("week", DateTime.fromISO("2021-08-27"))?.toISODate()).toBe(
      "2021-08-16"
    );
    expect(previous("week", DateTime.fromISO("2021-01-01"))?.toISODate()).toBe(
      "2020-12-21"
    );
  });
  test("Returns previous month", () => {
    expect(previous("month", DateTime.fromISO("2021-08-31"))?.toISODate()).toBe(
      "2021-07-01"
    );
    expect(previous("month", DateTime.fromISO("2021-08-01"))?.toISODate()).toBe(
      "2021-07-01"
    );
    expect(previous("month", DateTime.fromISO("2021-01-01"))?.toISODate()).toBe(
      "2020-12-01"
    );
  });
});

describe("next (day, week, month, year)", () => {
  test("Returns next day", () => {
    expect(next("day", DateTime.fromISO("2021-08-23"))?.toISODate()).toBe(
      "2021-08-24"
    );
    expect(next("day", DateTime.fromISO("2021-07-31"))?.toISODate()).toBe(
      "2021-08-01"
    );
    expect(next("day", DateTime.fromISO("2020-12-31"))?.toISODate()).toBe(
      "2021-01-01"
    );
  });
  test("Returns next week", () => {
    expect(next("week", DateTime.fromISO("2021-08-16"))?.toISODate()).toBe(
      "2021-08-23"
    );
    expect(next("week", DateTime.fromISO("2021-08-22"))?.toISODate()).toBe(
      "2021-08-23"
    );
    expect(next("week", DateTime.fromISO("2020-12-28"))?.toISODate()).toBe(
      "2021-01-04"
    );
  });
  test("Returns next month", () => {
    expect(next("month", DateTime.fromISO("2021-07-01"))?.toISODate()).toBe(
      "2021-08-01"
    );
    expect(next("month", DateTime.fromISO("2021-07-31"))?.toISODate()).toBe(
      "2021-08-01"
    );
    expect(next("month", DateTime.fromISO("2020-12-01"))?.toISODate()).toBe(
      "2021-01-01"
    );
  });
});
