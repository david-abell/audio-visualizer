import { useMemo, useRef, useState } from "react";
import { shuffle } from "lodash";

import Player from "./components/Player";
import SpectrumGraph from "./components/SpectrumGraph";
import library from "./assets/library";
import PlayList from "./components/Playlist";
import PlaylistDetail from "./components/PlaylistDetail";

import styles from "./styles/App.module.css";

import { FilterBy, Track, TracksMap } from "./types/types";

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
  const [shuffleCount, setShuffleCount] = useState(0);

  const filteredTracks = useMemo(() => {
    const filterTracks = [...tracks.values()].filter((track: Track) =>
      track[filterBy].toLowerCase().includes(trackFilter.toLowerCase().trim())
    );

    if (shuffleCount > 0) {
      return shuffle(filterTracks);
    }

    return filterTracks;
  }, [shuffleCount, tracks, filterBy, trackFilter]);

  const handleSetTrack = (id: string) => {
    const nextTrack = tracks.get(id);
    if (nextTrack) {
      setCurrentTrack(nextTrack);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Spectrum Audio</h1>
      </header>
      <div className={styles.content}>
        <PlaylistDetail
          tracks={tracks}
          currentTrack={currentTrack}
          setShuffleCount={setShuffleCount}
        />
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
      </div>
      <footer
        className={
          !showPlayer
            ? styles.footer
            : [styles.footer, styles.playerFooter].join(" ")
        }
      >
        <h5>This is the footer</h5>
      </footer>
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
