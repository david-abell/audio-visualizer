import { Icon } from "@iconify/react/dist/offline";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";

import styles from "../styles/Playlist.module.css";
import usePlayer from "../hooks/usePlayer";

import {
  AudioRef,
  FilterBy,
  RangeRef,
  Track,
  TrackFilters,
} from "../types/types";
import formatTime from "../utils/formatTime";

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
  const { play, pause, isPlaying } = usePlayer(
    audioRef,
    progressBarRef,
    volumeRef
  );

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
      {/* Album Cover */}
      {/* <div className={styles.albumCover}>
        <img src={currentTrack.cover} alt="Album cover" />
      </div> */}

      <div className={styles.listFilterContainer}>
        {/* Playlist search */}
        <div className={styles.filterContainer}>
          <input
            type="text"
            onChange={(e) => handleFilterInput(e)}
            aria-label="Search for"
          />

          <select
            value={filterBy}
            aria-label="search by"
            onChange={(e) => handleSelectFilterBy(e)}
          >
            {/* option values are not typechecked... */}
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>
        </div>

        {/* Playlist */}
        <div className={styles.listContainer}>
          {/* Current playlist */}
          {!!filteredTracks.length && (
            <ul>
              {filteredTracks.map((track: Track) => (
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
                    data-testid="playlist-track-button"
                  >
                    <Icon
                      icon={
                        isPlaying && track.id === currentTrack.id
                          ? pauseIcon
                          : playIcon
                      }
                    />
                    <hgroup className={styles.titleGroup}>
                      <h3>{track.title}</h3>
                      <p>{track.artist}</p>
                    </hgroup>
                    <span>{formatTime(track.length, true)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayList;
