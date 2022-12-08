import { useRef, useState } from "react";
import styles from "./styles/App.module.css";
import Player from "./components/Player";
import SpectrumGraph from "./components/SpectrumGraph";
import library from "./assets/library";
import PlayList from "./components/Playlist";

import { FilterBy, Track, TracksMap } from "./types/types";
import PlaylistDetail from "./components/PlaylistDetail";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tracks, setTracks] = useState<TracksMap>(library);
  const [currentTrack, setCurrentTrack] = useState<Track>([...tracks][0][1]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [trackFilter, setTrackFilter] = useState("");
  const [filterBy, setFilterBy] = useState<FilterBy>("title");

  const filteredTracks = [...tracks.values()].filter((track: Track) =>
    track[filterBy].toLowerCase().includes(trackFilter.toLowerCase().trim())
  );

  const handleSetTrack = (id: string) => {
    const nextTrack = tracks.get(id);
    if (nextTrack) {
      setCurrentTrack(nextTrack);
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <h1>Spectrum Audio</h1>
        <PlaylistDetail tracks={tracks} currentTrack={currentTrack} />
        <PlayList
          currentTrack={currentTrack}
          handleSetTrack={handleSetTrack}
          filteredTracks={filteredTracks}
          audioRef={audioRef}
          progressBarRef={progressBarRef}
          volumeRef={volumeRef}
          setShowPlayer={setShowPlayer}
          setTrackFilter={setTrackFilter}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
        <div className={styles.footer}>
          <h5>This is the footer</h5>
        </div>
      </div>
      {showPlayer && (
        <div className={styles.fixedBottom}>
          <SpectrumGraph audioRef={audioRef} />
          <Player
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            volumeRef={volumeRef}
            handleSetTrack={handleSetTrack}
            currentTrack={currentTrack}
            setShowPlayer={setShowPlayer}
            filteredTracks={filteredTracks}
          />
        </div>
      )}
    </div>
  );
}

export default App;
