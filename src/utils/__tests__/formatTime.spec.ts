import { expect, test } from "vitest";
import formatTime from "../formatTime";

test("should be 0", () => {
  expect(formatTime(0)).toBe("00:00");
});

test("should handle negatives", () => {
  expect(formatTime(-1.01)).toBe("00:00");
});

test("should be 00:59", () => {
  expect(formatTime(59.999)).toBe("00:59");
});

test("should be 10:10", () => {
  expect(formatTime(610)).toBe("10:10");
});
