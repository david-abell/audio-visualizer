import { expect, test } from "vitest";
import { ViewBoxMap } from "../../components/SpectrumGraph";

import getLinePaths from "../getLinePaths";

test("should return paths for all data except 0s", () => {
  const testData = [0, 255, 255, 255, 10, 5];
  const testViewBox: ViewBoxMap = {
    SVGWidth: 100,
    SVGHeight: 10,
    SVGMinX: 0,
    SVGMinY: 0,
  };

  expect(getLinePaths(testData, testViewBox)).toHaveLength(5);
});

test("empty input should return empty array", () => {
  const testData: number[] = [];
  const testViewBox: ViewBoxMap = {
    SVGWidth: 100,
    SVGHeight: 10,
    SVGMinX: 0,
    SVGMinY: 0,
  };

  expect(getLinePaths(testData, testViewBox)).toHaveLength(0);
});

test("should return a wide and narrow path", () => {
  const testData = [255, 1];
  const testViewBox: ViewBoxMap = {
    SVGWidth: 100,
    SVGHeight: 10,
    SVGMinX: 0,
    SVGMinY: 0,
  };

  const result = [
    {
      color: "rgb(110, 64, 170)",
      path: "M0,10L0,0",
      width: 99.609375,
    },
    {
      color: "rgb(113, 64, 171)",
      path: "M99.609375,10L99.609375,9.96078431372549",
      width: 0.390625,
    },
  ];

  expect(getLinePaths(testData, testViewBox)).toEqual(result);
});
