import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "../styles/SpectrumGraph.module.css";
import { AudioRef, RawData, LinePath } from "../types/types";
import useRequestAnimationFrame from "../useRequestAnimationFrame";
import getLinePaths from "../utils/getLinePaths";

interface Props {
  audioRef: AudioRef;
}

// Set svg aspect ratio
const viewBoxMap = {
  SVGMinX: 0,
  SVGMinY: 0,
  SVGWidth: 200,
  SVGHeight: 10,
};
const svgViewbox = Object.values(viewBoxMap).join(" ");

export type ViewBoxMap = typeof viewBoxMap;

function SpectrumGraph({ audioRef }: Props) {
  const [rawData, setRawData] = useState<RawData>([]);

  // References
  const audioContextRef = useRef<AudioContext | undefined>();
  const sourceRef = useRef<MediaElementAudioSourceNode | undefined>();
  const analyzerRef = useRef<AnalyserNode | undefined>();
  const dataArray = useRef<Uint8Array | undefined>();

  // Initialize audio context and analyzer and connect to audio sourcenode
  const initContext = () => {
    if (!audioRef.current || audioContextRef.current) return;
    audioContextRef.current = new AudioContext();

    analyzerRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaElementSource(
      audioRef.current
    );

    // Must be one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768.
    // React chockes at counts greater than 256 with this draw method.
    analyzerRef.current.fftSize = 128;

    // Half fftSize value. This is the total number of bars graphed
    const bufferLength = analyzerRef.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength);

    sourceRef.current.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContextRef.current.destination);
  };

  // Request animation frame update function
  const update = useCallback(() => {
    if (!dataArray.current || !analyzerRef.current) return;
    analyzerRef.current.getByteFrequencyData(dataArray.current);
    setRawData([...dataArray.current]);
  }, []);

  const { handleStartAnimation, handleStopAnimation } =
    useRequestAnimationFrame(update);

  if (!audioContextRef.current) {
    initContext();
  }

  // Setup playback event listeners
  useEffect(() => {
    const audioNode = audioRef.current;
    if (!audioNode) return undefined;

    audioNode.addEventListener("pause", handleStopAnimation);
    audioNode.addEventListener("play", handleStartAnimation);
    audioNode.addEventListener("playing", handleStartAnimation);

    return () => {
      audioNode.removeEventListener("pause", handleStopAnimation);
      audioNode.removeEventListener("play", handleStartAnimation);
      audioNode.removeEventListener("playing", handleStartAnimation);
    };
  }, [handleStartAnimation, handleStopAnimation, audioRef]);

  // Compute Svg paths from raw analyzer data
  const paths = useMemo<LinePath[]>(
    () => getLinePaths(rawData, viewBoxMap),
    [rawData]
  );

  return (
    <div className={styles.visualizerContainer}>
      <svg
        width="100%"
        height="100%"
        viewBox={svgViewbox}
        preserveAspectRatio="none"
      >
        <g>
          {paths.map(({ path, color, width }) => (
            <path
              d={path}
              stroke={color}
              strokeWidth={width}
              key={`${path}${color}`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default SpectrumGraph;
