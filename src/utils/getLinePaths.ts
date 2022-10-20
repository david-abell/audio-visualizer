import { interpolateRainbow, line } from "d3";
import { RawData, LinePath } from "../types/types";
import type { ViewBoxMap } from "../components/SpectrumGraph";

const lineBuilder = line();

function getLinePaths(data: RawData, viewBox: ViewBoxMap): LinePath[] {
  const result: LinePath[] = [];
  const total = data.reduce((acc, val) => acc + val, 0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { SVGHeight, SVGMinX, SVGMinY, SVGWidth } = viewBox;
  let currentX = SVGMinX;

  const padLineWidth = 0.2;

  for (const value of data) {
    const width = (value / total) * SVGWidth;
    const scaledValue = value / 255;
    const barHeight = SVGHeight * scaledValue;

    const color = scaledValue
      ? interpolateRainbow(scaledValue)
      : "rgb(0, 0, 0, 0)";

    const path = lineBuilder([
      [currentX, SVGHeight + SVGMinY],
      [currentX, SVGHeight + SVGMinY - barHeight],
    ]);
    if (scaledValue && !Number.isNaN(width) && path) {
      result.push({ path, color, width: width + padLineWidth });
    }
    currentX += width;
  }
  return result;
}

export default getLinePaths;
