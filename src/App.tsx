import { useState } from "react";
import "./App.css";
import Player from "./components/Player";
import SpectrumGraph from "./components/SpectrumGraph";
import { Track } from "./types/types";
import useAudioSource from "./useAudioSource";
import library from "./assets/library";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tracks, setTracks] = useState<Track[]>(library);
  const [currentTrack, setCurrentTrack] = useState(0);
  const { audioRef } = useAudioSource(tracks[currentTrack]);

  return (
    <div className="app">
      <img src={tracks[currentTrack].cover} alt="Album cover" />
      <SpectrumGraph audioRef={audioRef} />
      <Player
        audioRef={audioRef}
        setCurrentTrack={setCurrentTrack}
        tracks={tracks}
        currentTrack={currentTrack}
      />
    </div>
  );
}

export default App;
