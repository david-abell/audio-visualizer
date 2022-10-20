import { useEffect, useRef } from "react";
import type { Track } from "./types/types";

export type RawData = number[];

function useAudioSource(track: Track) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const sourceRef = useRef<MediaSource>();

  useEffect(() => {
    const mimeCodec = "audio/mpeg";
    if (audioRef.current && MediaSource.isTypeSupported(mimeCodec)) {
      sourceRef.current = new MediaSource();
      const url = URL.createObjectURL(sourceRef.current);

      audioRef.current.src = url;

      const fetchArrayBuffer = async (): Promise<ArrayBuffer | undefined> => {
        try {
          const result = await fetch(`/${track.url}`);
          if (!result.ok) {
            throw new Error("Something went wrong");
          }
          const resultBuffer = await result.arrayBuffer();

          return resultBuffer;
        } catch (error) {
          let message = "Unknown Error";
          if (error instanceof Error) message = error.message;
          // eslint-disable-next-line no-console
          console.log(message);
          return undefined;
        }
      };

      sourceRef.current.addEventListener("sourceopen", () => {
        const sourceBuffer = sourceRef.current?.addSourceBuffer(mimeCodec);
        // eslint-disable-next-line no-console
        sourceBuffer?.addEventListener("error", console.log);

        fetchArrayBuffer()
          .then((data) => {
            if (!data || !sourceBuffer) {
              return undefined;
            }
            sourceBuffer.addEventListener("updateend", () => {
              sourceRef.current?.endOfStream();
            });
            return sourceBuffer.appendBuffer(data);
          })
          // eslint-disable-next-line no-console
          .catch((e) => console.log(e));
      });
    }
  }, [track]);

  return { sourceRef, audioRef };
}

export default useAudioSource;
