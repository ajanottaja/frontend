import { Uuid } from "./schema";

describe("Uuid", () => {
  test("Validates if string is uuid", () => {
    expect(Uuid.validate("foo")[1]).toBeUndefined();
    expect(Uuid.validate("123e4567-e89b-12d3-a456-426614174000")[1]).toBe("123e4567-e89b-12d3-a456-426614174000")
  });
});