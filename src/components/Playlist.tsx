import { Icon } from "@iconify/react/dist/offline";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";
import shallow from "zustand/shallow";

import { useState } from "react";
import styles from "../styles/Playlist.module.css";
import usePlayer from "../hooks/usePlayer";
import usePlayerStore from "../hooks/usePlayerStore";

import { AudioRef, RangeRef, Track } from "../types/types";

type Props = {
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  audioRef: AudioRef;
  progressBarRef: RangeRef;
  volumeRef: RangeRef;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
};

function PlayList({
  currentTrack,
  setCurrentTrack,
  tracks,
  audioRef,
  progressBarRef,
  volumeRef,
  setShowPlayer,
}: Props) {
  const { play, pause } = usePlayer(
    audioRef,
    progressBarRef,
    volumeRef,
    tracks,
    currentTrack,
    setCurrentTrack
  );

  const isPlaying = usePlayerStore((state) => state.isPlaying, shallow);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredTracks = tracks.filter((el) =>
    el.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectTrack = (num: number) => {
    setShowPlayer(true);
    if (currentTrack !== num || (currentTrack === num && !isPlaying)) {
      setCurrentTrack(num);
      play();
    } else {
      pause();
    }
  };

  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.albumCover}>
        <img src={tracks[currentTrack].cover} alt="Album cover" />
      </div>
      <div className={styles.listContainer}>
        <h2>Playlist</h2>
        <input type="text" onChange={(e) => handleFilterInput(e)} />
        <ul>
          {!!filteredTracks.length &&
            filteredTracks.map((track: Track, index: number) => (
              <li
                key={track.title}
                className={
                  currentTrack === index
                    ? [styles.listItem, styles.isPlaying].join(" ")
                    : styles.listItem
                }
              >
                <button
                  type="button"
                  onClick={() => handleSelectTrack(index)}
                  className={styles.button}
                >
                  <Icon
                    icon={
                      isPlaying && index === currentTrack ? pauseIcon : playIcon
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
