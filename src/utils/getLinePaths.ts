import { interpolateRainbow, line } from "d3";
import { RawData, LinePath } from "../types/types";
import type { ViewBoxMap } from "../components/SpectrumGraph";

const lineBuilder = line();

function getLinePaths(data: RawData, viewBox: ViewBoxMap): LinePath[] {
  const result: LinePath[] = [];
  const total = data.reduce((acc, val) => acc + val, 0);

  const { SVGHeight, SVGMinX, SVGMinY, SVGWidth } = viewBox;
  let currentX = SVGMinX;

  for (const value of data) {
    if (!value) break;
    const width = (value / total) * SVGWidth;
    const scaledValue = value / 255;
    const barHeight = SVGHeight * scaledValue;

    const color = interpolateRainbow(scaledValue);

    const path = lineBuilder([
      [currentX, SVGHeight + SVGMinY],
      [currentX, SVGHeight + SVGMinY - barHeight],
    ]);
    if (path) {
      result.push({ path, color, width });
    }
    currentX += width;
  }
  return result;
}

export default getLinePaths;
