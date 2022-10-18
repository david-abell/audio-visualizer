import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./SpectrumGraph.module.css";
// import useAudioSource from "./useAudioSource";
import { AudioRef, RawData, LinePath } from "./types/types";
import useRequestAnimationFrame from "./useRequestAnimationFrame";
import getLinePaths from "./utils/getLinePaths";

interface Props {
  audioRef: AudioRef;
}

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

    analyzerRef.current.fftSize = 512;
    bufferLength.current = analyzerRef.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);

    sourceRef.current
      ?.connect(analyzerRef.current)
      .connect(audioContextRef.current.destination);
  };

  const update = () => {
    if (!dataArray.current || !analyzerRef.current) return;
    analyzerRef.current.getByteFrequencyData(dataArray.current);
    const orig = [...dataArray.current];
    setRawData(orig);
  };

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

  const paths = useMemo<LinePath[]>(() => getLinePaths(rawData), [rawData]);

  return (
    <div className={styles.visualizerContainer}>
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
    </div>
  );
}

export default SpectrumGraph;
