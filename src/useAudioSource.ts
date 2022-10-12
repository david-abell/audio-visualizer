import { useState, useEffect, useRef } from "react";
import useRequestAnimationFrame from "./useRequestAnimationFrame";

export type RawData = number[];

function useAudioSource() {
  const [rawData, setRawData] = useState<RawData>([]);
  const [byteArray, setByteArray] = useState<ArrayBuffer>();
  const [isError, setIsError] = useState<false | string>(false);

  const audioContextRef = useRef<AudioContext | undefined>();
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | undefined>();

  const analyzerRef = useRef<AnalyserNode | undefined>();

  const bufferLength = useRef<number | undefined>();
  const dataArray = useRef<Uint8Array | undefined>();

  const initContext = async () => {
    if (!byteArray || sourceRef.current) return;
    audioContextRef.current = new AudioContext();
    audioBufferRef.current = await audioContextRef.current.decodeAudioData(
      byteArray
    );
    analyzerRef.current = audioContextRef.current.createAnalyser();
    analyzerRef.current.fftSize = 512;
    analyzerRef.current.connect(audioContextRef.current.destination);
    sourceRef.current = audioContextRef.current.createBufferSource();
    sourceRef.current.buffer = audioBufferRef.current;
    sourceRef.current.connect(audioContextRef.current.destination);
    sourceRef.current.start();
    bufferLength.current = analyzerRef.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);
    sourceRef.current.connect(analyzerRef.current);
  };

  // fetch media
  useEffect(() => {
    if (byteArray) return;
    const fetchMedia = async (): Promise<void> => {
      try {
        const result = await fetch("/GothamCity.mp3");
        if (!result.ok) {
          throw new Error("Something went wrong");
        }
        const resultByteArray = await result.arrayBuffer();
        setByteArray(resultByteArray);
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        setIsError(message);
      }
    };
    // Floating promise expected here
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMedia();
  }, [byteArray]);

  const update = () => {
    // console.log("dataArray", dataArray);
    if (!dataArray || !analyzerRef.current) return;
    analyzerRef.current.getByteFrequencyData(dataArray.current as Uint8Array);
    const orig = Array.from(dataArray.current as Uint8Array);
    setRawData([[...orig].reverse(), orig].flat());
  };

  const { handleToggleAnimation } = useRequestAnimationFrame(update);

  const handlePlay = async () => {
    if (!audioContextRef.current) {
      await initContext();
    } else if (audioContextRef.current.state === "running") {
      audioContextRef.current
        .suspend()
        .catch(() =>
          setIsError("there was an error while attempting to pause")
        );
    } else {
      audioContextRef.current
        .resume()
        .catch(() =>
          setIsError("there was an error while attempting to resume")
        );
    }
    handleToggleAnimation();
  };

  return { handlePlay, rawData, isError };
}

export default useAudioSource;
