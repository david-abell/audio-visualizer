import { useRef, useEffect } from "react";
import "./App.css";
import Player from "./components/Player";
import SpectrumGraph from "./SpectrumGraph";

const SOURCE_NAME = "GothamCity.mp3";

function App() {
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
          const result = await fetch(`/${SOURCE_NAME}`);
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
  }, []);

  return (
    <div className="App">
      <SpectrumGraph audioRef={audioRef} />
      <Player audioRef={audioRef} />
    </div>
  );
}

export default App;
