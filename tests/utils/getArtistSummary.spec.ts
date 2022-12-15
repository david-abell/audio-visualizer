import { expect, test } from "vitest";

import getArtistSummary from "../../src/utils/getArtistSummary";

test("should return a string", () => {
  const artists = new Set(["John", "Jack", "Mary", "Jane"]);
  expect(getArtistSummary(artists)).toBeTypeOf("string");
});

test("should handle empty set", () => {
  const artists = new Set([]);
  expect(getArtistSummary(artists)).toBe("None");
});

test("should return a string", () => {
  const artists = new Set(["John"]);
  expect(getArtistSummary(artists)).toBe("John");
});

test("should return a string", () => {
  const artists = new Set(["John", "Jack"]);
  expect(getArtistSummary(artists)).toBe("John and Jack");
});

test("should return a string", () => {
  const artists = new Set(["John", "Jack", "Mary"]);
  expect(getArtistSummary(artists)).toBe("John, Jack, and Mary");
});

test("should return a string", () => {
  const artists = new Set([
    "John",
    "Jack",
    "Mary",
    "one more",
    "two more",
    "three more",
    "four more",
  ]);
  expect(getArtistSummary(artists)).toBe("John, Jack, Mary, and 4 others");
});
