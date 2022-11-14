import { Icon } from "@iconify/react/dist/offline";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";
import shallow from "zustand/shallow";

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

  const handleSelectTrack = (num: number) => {
    setShowPlayer(true);
    if (currentTrack !== num || (currentTrack === num && !isPlaying)) {
      setCurrentTrack(num);
      play();
    } else {
      pause();
    }
  };

  return (
    <div className={styles.container}>
      <img src={tracks[currentTrack].cover} alt="Album cover" />
      <ul>
        {!!tracks.length &&
          tracks.map((track: Track, index: number) => (
            <li key={track.title} className={styles.listItem}>
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
                <p>{track.title}</p>
                <span>{track.artist}</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default PlayList;
