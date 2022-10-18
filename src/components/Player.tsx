import { useState } from "react";
import { AudioRef } from "../types/types";

const SOURCE_NAME = "GothamCity.mp3";

interface Props {
  audioRef: AudioRef;
}

function Player({ audioRef }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTrack, setCurrentTrack] = useState(SOURCE_NAME);

  return (
    <audio controls src={`/${currentTrack}`} ref={audioRef} preload="metadata">
      <track kind="captions" />
    </audio>
  );
}

export default Player;
