import { useState } from "react";
import "./App.css";
import styleUtils from "./styles/styleUtils.module.css";
import Player from "./components/Player";
import SpectrumGraph from "./components/SpectrumGraph";
import { Track } from "./types/types";
import useAudioSource from "./useAudioSource";
import library from "./assets/library";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tracks, setTracks] = useState<Track[]>(library);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { audioRef } = useAudioSource(tracks[currentTrack]);

  return (
    <div className={["app", styleUtils.gap].join(" ")}>
      <img src={tracks[currentTrack].cover} alt="Album cover" />
      <SpectrumGraph audioRef={audioRef} />
      <Player
        audioRef={audioRef}
        setCurrentTrack={setCurrentTrack}
        tracks={tracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}

export default App;
