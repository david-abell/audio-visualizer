import { useEffect, useState } from "react";

const url = "GothamCity.mp3";

function useAudioFile() {
  const [currentTrack, setCurrentTrack] = useState("");
  const [isError, setIsError] = useState<false | string>(false);

  useEffect(() => {
    if (currentTrack) return;
    const fetchMedia = async (): Promise<void> => {
      try {
        const result = await fetch(`/${url}`);
        if (!result.ok) {
          throw new Error("Something went wrong");
        }
        const audioBlob = await result.blob();
        setCurrentTrack(URL.createObjectURL(audioBlob));
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        setIsError(message);
      }
    };
    // Floating promise expected here
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMedia();
  }, [currentTrack]);

  return { data: currentTrack, isError };
}

export default useAudioFile;
