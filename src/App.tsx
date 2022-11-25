import { useRef, useState } from "react";
import styles from "./styles/App.module.css";
import styleUtils from "./styles/styleUtils.module.css";
import Player from "./components/Player";
import SpectrumGraph from "./components/SpectrumGraph";
import { Track } from "./types/types";
import library from "./assets/library";
import PlayList from "./components/Playlist";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tracks, setTracks] = useState<Track[]>(library);
  const [currentTrack, setCurrentTrack] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className={[styles.app, styleUtils.gap].join(" ")}>
      <div className={styles.content}>
        <h1>Spectrum Audio Player</h1>
        <PlayList
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          tracks={tracks}
          audioRef={audioRef}
          progressBarRef={progressBarRef}
          volumeRef={volumeRef}
          setShowPlayer={setShowPlayer}
          // isPlaying={isPlaying}
          // setIsPlaying={setIsPlaying}
        />
      </div>
      {showPlayer && (
        <div className={styles.fixedBottom}>
          <SpectrumGraph audioRef={audioRef} />
          <Player
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            volumeRef={volumeRef}
            setCurrentTrack={setCurrentTrack}
            tracks={tracks}
            currentTrack={currentTrack}
            setShowPlayer={setShowPlayer}
            // isPlaying={isPlaying}
            // setIsPlaying={setIsPlaying}
          />
        </div>
      )}
    </div>
  );
}

export default App;
