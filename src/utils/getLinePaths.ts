import { interpolateRainbow, line } from "d3";
import { RawData, LinePath } from "../types/types";
import type { ViewBoxMap } from "../SpectrumGraph";

const lineBuilder = line();

function getLinePaths(data: RawData, viewBox: ViewBoxMap): LinePath[] {
  const result: LinePath[] = [];
  const total = data.reduce((acc, val) => acc + val, 0);

  let currentX = viewBox.SVGMinX;
  const xRange = viewBox.SVGWidth;
  const yRange = viewBox.SVGHeight;

  const padLineWidth = 0.2;

  for (const value of data) {
    const width = (value / total) * xRange;

    const scaledValue = value / 255;

    const barHeight = yRange * scaledValue;

    const color = scaledValue
      ? interpolateRainbow(scaledValue)
      : "rgb(0, 0, 0, 0)";

    const path = lineBuilder([
      [currentX, viewBox.SVGHeight],
      [currentX, viewBox.SVGHeight - barHeight - 0.3 * viewBox.SVGHeight],
    ]);
    if (!Number.isNaN(width) && path) {
      result.push({ path, color, width: width + padLineWidth });
    }
    currentX += width;
  }
  return result;
}

export default getLinePaths;
