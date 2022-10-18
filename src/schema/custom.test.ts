import { DateTime, Settings } from "luxon";
import { tsRangeObjectToString } from "./custom";

// Force tests to run with utc timezone to simplify testing
Settings.defaultZone = "utc";

describe("tsRangeObjectToString", () => {
  it("should transform a tsRangeObject to a valid postgres tsrange string", () => {
    const tsRangeObject = {
      lower: DateTime.fromISO("2020-01-01T00:00:00.000Z"),
      upper: DateTime.fromISO("2020-01-01T12:00:00.000Z"),
      lowerInclusive: true,
      upperInclusive: false,
    };
    const result = tsRangeObjectToString.safeParse(tsRangeObject);
    expect(result.success).toBe(true);
    expect(result.success && result.data).toBe(
      "[2020-01-01 00:00:00.000Z,2020-01-01 12:00:00.000Z)"
    );
  });

  it("should transform a tsRangeObject to a valid postgres tsrange string with no upper bound", () => {
    const tsRangeObject = {
      lower: DateTime.fromISO("2020-01-01T00:00:00.000Z"),
      lowerInclusive: true,
    };
    const result = tsRangeObjectToString.safeParse(tsRangeObject);
    expect(result.success).toBe(true);
    expect(result.success && result.data).toBe("[2020-01-01 00:00:00.000Z,)");
  });

  it("should transform a tsRangeObject to a valid postgres tsrange string with no lower bound", () => {
    const tsRangeObject = {
      upper: DateTime.fromISO("2020-01-01T00:00:00.000Z"),
      upperInclusive: true,
    };
    const result = tsRangeObjectToString.safeParse(tsRangeObject);
    expect(result.success).toBe(true);
    expect(result.success && result.data).toBe("[,2020-01-01 00:00:00.000Z]");
  });
});
