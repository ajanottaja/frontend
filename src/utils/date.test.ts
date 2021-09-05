import { DateTime, Duration } from "luxon";
import { daysOfMonth, absDuration, isNegativeDuration } from "./date";

describe("daysOfMonth", () => {
  test("Returns a list of all dates in same month as supplied date", () => {
    const dates = daysOfMonth(DateTime.fromISO("2021-08-23"));
    expect(dates.length).toBe(31);
    expect(dates[0].day).toBe(1);
    expect(dates[30].day).toBe(31);
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

