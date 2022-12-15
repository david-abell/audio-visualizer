import { expect, test } from "vitest";
import formatDescriptiveTime from "../../src/utils/formatDescriptiveTime";

test("should be 0 minutes", () => {
  expect(formatDescriptiveTime(59.999)).toBe("0 minutes");
});

test("should be 1 hour one minute", () => {
  expect(formatDescriptiveTime(840)).toBe("14 minutes");
});

test("should be 59 minutes", () => {
  expect(formatDescriptiveTime(3590)).toBe("59 minutes");
});

test("should be 1 hour", () => {
  expect(formatDescriptiveTime(3601)).toBe("1 hour");
});

test("should be 1 hour one minute", () => {
  expect(formatDescriptiveTime(3661)).toBe("1 hour 1 minute");
});
