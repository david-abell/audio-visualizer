import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useMediaQuery } from "usehooks-ts";

import styles from "../styles/SpectrumGraph.module.css";

import useRequestAnimationFrame from "../hooks/useRequestAnimationFrame";
import getLinePaths from "../utils/getLinePaths";
import useAudioContext from "../hooks/useAudioContext";

import { AudioRef, RawData, LinePath } from "../types/types";

interface Props {
  audioRef: AudioRef;
}

// Set svg aspect ratio
const deskTopViewBoxMap = {
  SVGMinX: 0,
  SVGMinY: 0,
  SVGWidth: 200,
  SVGHeight: 10,
};

const mobileViewBoxMap = {
  ...deskTopViewBoxMap,
  SVGHeight: 40,
};

export type ViewBoxMap = typeof deskTopViewBoxMap;

function SpectrumGraph({ audioRef }: Props) {
  const [rawData, setRawData] = useState<RawData>([]);
  const { audioContext } = useAudioContext();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const svgViewbox = isMobile
    ? Object.values(mobileViewBoxMap).join(" ")
    : Object.values(deskTopViewBoxMap).join(" ");

  const viewBoxMap = useMemo(
    () => (isMobile ? mobileViewBoxMap : deskTopViewBoxMap),
    [isMobile]
  );

  // References
  const sourceRef = useRef<MediaElementAudioSourceNode | undefined>();
  const analyzerRef = useRef<AnalyserNode | undefined>();
  const dataArray = useRef<Uint8Array | undefined>();

  // Request animation frame update function
  const update = useCallback(() => {
    if (!dataArray.current || !analyzerRef.current) return;
    analyzerRef.current.getByteFrequencyData(dataArray.current);
    setRawData([...dataArray.current]);
  }, []);

  const { handleStartAnimation, handleStopAnimation } =
    useRequestAnimationFrame(update);

  // Initialize analyzer and connect to audio sourcenode
  useEffect(() => {
    if (
      !audioRef.current ||
      !audioContext ||
      audioContext.state === "closed" ||
      analyzerRef.current
    ) {
      return undefined;
    }

    analyzerRef.current = audioContext.createAnalyser();

    // fftSize must be one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768.
    // React chokes at counts greater than 256 with this draw method.
    analyzerRef.current = new AnalyserNode(audioContext, {
      fftSize: 256,
      // maxDecibels: -5,
      minDecibels: -90,
      // smoothingTimeConstant: 0.8, // default value 0.8
    });

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(
        audioRef.current
      );
    }

    // Half fftSize value. This is the total number of bars graphed
    const bufferLength = analyzerRef.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength);

    sourceRef.current.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContext.destination);

    return () => {
      analyzerRef.current?.disconnect();
      analyzerRef.current = undefined;
    };
  }, [audioContext, audioRef]);

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
    [rawData, viewBoxMap]
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
