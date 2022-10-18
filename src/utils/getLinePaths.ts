import { interpolateRainbow, line } from "d3";
import { RawData, LinePath } from "../types/types";

const lineBuilder = line();

function getLinePaths(data: RawData): LinePath[] {
  const result: LinePath[] = [];
  let currentX = 100;
  const range = 100;
  const getY = (num: number) => num / 255;
  const total = data.reduce((acc, val) => acc + val, 0);

  for (const value of data) {
    const amplitude = (value / total) * range;
    const nextX = currentX - amplitude;

    const y = getY(value) * amplitude * 1000;
    const color = y ? interpolateRainbow(value / 255) : "rgb(0, 0, 0, 0)";
    const path = lineBuilder([
      [currentX, 100],
      [currentX, amplitude * 100],
    ]);
    if (amplitude > 0.15 && path) {
      result.push({ path, color, amplitude });
    }
    currentX = nextX;
  }
  return result;
}

export default getLinePaths;
