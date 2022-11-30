import { Icon } from "@iconify/react/dist/offline";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";
import shallow from "zustand/shallow";

import styles from "../styles/Playlist.module.css";
import usePlayer from "../hooks/usePlayer";
import usePlayerStore from "../hooks/usePlayerStore";

import {
  AudioRef,
  FilterBy,
  RangeRef,
  Track,
  TrackFilters,
} from "../types/types";

type Props = {
  currentTrack: Track;
  handleSetTrack: (id: string) => void;
  setTrackFilter: React.Dispatch<React.SetStateAction<string>>;
  filterBy: FilterBy;
  setFilterBy: React.Dispatch<React.SetStateAction<TrackFilters>>;
  filteredTracks: Track[];
  audioRef: AudioRef;
  progressBarRef: RangeRef;
  volumeRef: RangeRef;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
};

function PlayList({
  currentTrack,
  handleSetTrack,
  filterBy,
  setFilterBy,
  filteredTracks,
  setTrackFilter,
  audioRef,
  progressBarRef,
  volumeRef,
  setShowPlayer,
}: Props) {
  const { play, pause } = usePlayer(audioRef, progressBarRef, volumeRef);

  const isPlaying = usePlayerStore((state) => state.isPlaying, shallow);

  const handleSelectTrack = (id: string) => {
    setShowPlayer(true);
    if (currentTrack.id !== id || (currentTrack.id === id && !isPlaying)) {
      handleSetTrack(id);
      play();
    } else {
      pause();
    }
  };

  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackFilter(e.target.value);
  };

  const handleSelectFilterBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(e.target.value as FilterBy);
  };

  return (
    <div className={styles.container}>
      <div className={styles.albumCover}>
        <img src={currentTrack.cover} alt="Album cover" />
      </div>
      <div className={styles.listContainer}>
        <h2>Playlist</h2>
        <div className={styles.filterContainer}>
          <input type="text" onChange={(e) => handleFilterInput(e)} />

          <select
            value={filterBy}
            aria-label="search criteria"
            onChange={(e) => handleSelectFilterBy(e)}
          >
            {/* values are not typechecked here... */}
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>
        </div>
        <ul>
          {!!filteredTracks.length &&
            filteredTracks.map((track: Track) => (
              <li
                key={track.title}
                className={
                  currentTrack.id === track.id
                    ? [styles.listItem, styles.isPlaying].join(" ")
                    : styles.listItem
                }
              >
                <button
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={styles.button}
                >
                  <Icon
                    icon={
                      isPlaying && track.id === currentTrack.id
                        ? pauseIcon
                        : playIcon
                    }
                  />
                  <h3>{track.title}</h3>
                  <h4>{track.artist}</h4>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayList;
