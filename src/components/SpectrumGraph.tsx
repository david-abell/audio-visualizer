import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "../styles/SpectrumGraph.module.css";
import { AudioRef, RawData, LinePath } from "../types/types";
import useRequestAnimationFrame from "../useRequestAnimationFrame";
import getLinePaths from "../utils/getLinePaths";

interface Props {
  audioRef: AudioRef;
}

const viewBoxMap = {
  SVGMinX: 0,
  SVGMinY: 0,
  SVGWidth: 200, // 2x SVGMinX
  SVGHeight: 10, // 2x SVGMinY
};
const svgViewbox = Object.values(viewBoxMap).join(" ");

export type ViewBoxMap = typeof viewBoxMap;

function SpectrumGraph({ audioRef }: Props) {
  const [rawData, setRawData] = useState<RawData>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState<false | string>(false);

  const audioContextRef = useRef<AudioContext | undefined>();
  const sourceRef = useRef<MediaElementAudioSourceNode | undefined>();
  const analyzerRef = useRef<AnalyserNode | undefined>();

  const bufferLength = useRef<number | undefined>();
  const dataArray = useRef<Uint8Array | undefined>();

  const initContext = async () => {
    if (!audioRef.current || audioContextRef.current) return;
    audioContextRef.current = new AudioContext();

    analyzerRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaElementSource(
      audioRef.current
    );

    analyzerRef.current.fftSize = 256;
    bufferLength.current = analyzerRef.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);

    sourceRef.current.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContextRef.current.destination);
  };

  const update = useCallback(() => {
    if (!dataArray.current || !analyzerRef.current) return;
    analyzerRef.current.getByteFrequencyData(dataArray.current);
    // const orig = [...dataArray.current];
    // setRawData(orig);
    setRawData([...dataArray.current]);
  }, []);

  const { handleStartAnimation, handleStopAnimation } =
    useRequestAnimationFrame(update);

  if (!audioContextRef.current) {
    initContext().catch((e) => setIsError(String(e)));
  }

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
          {paths.map(({ path, color, width }, index) => (
            <path
              d={path}
              stroke={color}
              strokeWidth={width}
              // eslint-disable-next-line react/no-array-index-key
              key={`${path}${color}${index}`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default SpectrumGraph;
