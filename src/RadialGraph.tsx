import { arc, interpolateRainbow } from "d3";

import useAudioSource, { RawData } from "./useAudioSource";

const arcBuilder = arc();

interface Path {
  path: string;
  color: string;
}

function getPaths(data: RawData): Path[] {
  const result: Path[] = [];
  let currentAngle = 0;

  for (const value of data) {
    const nextAngle = currentAngle + Math.PI * 0.1;
    const path = arcBuilder({
      startAngle: currentAngle,
      endAngle: nextAngle,
      innerRadius: 50 - (value / 255) * 35,
      outerRadius: 50 + (value / 255) * 35,
    });
    if (path) {
      result.push({ path, color: interpolateRainbow(value / 255) });
    }
    currentAngle = nextAngle;
  }
  return result;
}

function RadialGraph() {
  const { handlePlay, rawData } = useAudioSource();

  const paths = getPaths(rawData);

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
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {paths.map(({ path, color }) => (
            <path d={path} fill={color} key={`${path}${color}`} />
          ))}
        </g>
      </svg>
    </button>
  );
}

export default RadialGraph;
