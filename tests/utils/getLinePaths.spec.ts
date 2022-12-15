import { expect, test } from "vitest";
import { ViewBoxMap } from "../../src/components/SpectrumGraph";

import getLinePaths from "../../src/utils/getLinePaths";

test("should return a string", () => {
  const testData = [0, 255, 255, 255];
  const testViewBox: ViewBoxMap = {
    SVGWidth: 100,
    SVGHeight: 10,
    SVGMinX: 0,
    SVGMinY: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = [
    {
      color: "rgb(110, 64, 170)",
      path: "M0,10L0,0",
      width: 50,
    },
    {
      color: "rgb(110, 64, 170)",
      path: "M50,10L50,0",
      width: 50,
    },
  ];

  expect(getLinePaths(testData, testViewBox)).toHaveLength(3);
});
