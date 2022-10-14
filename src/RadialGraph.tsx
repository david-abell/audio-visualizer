import { interpolateRainbow, line } from "d3";
import { useMemo } from "react";
import useAudioSource, { RawData } from "./useAudioSource";

const lineBuilder = line();

interface Path {
  path: string;
  color: string;
  amplitude: number;
}

function getLinePaths(data: RawData): Path[] {
  const result: Path[] = [];
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

function RadialGraph() {
  const { handlePlay, rawData } = useAudioSource();

  const paths = useMemo<Path[]>(() => getLinePaths(rawData), [rawData]);

  return (
    <button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => handlePlay()}
      type="button"
      className="visualizer-container"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {paths.map(({ path, color, amplitude }, index) => (
            <path
              d={path}
              stroke={color}
              strokeWidth={amplitude}
              // eslint-disable-next-line react/no-array-index-key
              key={`${path}${color}${index}`}
            />
          ))}
        </g>
      </svg>
    </button>
  );
}

export default RadialGraph;
