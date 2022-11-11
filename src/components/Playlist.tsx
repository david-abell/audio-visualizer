import { Icon } from "@iconify/react/dist/offline";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";
import { Track } from "../types/types";
import styles from "../styles/Playlist.module.css";

type Props = {
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PlayList({
  currentTrack,
  setCurrentTrack,
  tracks,
  isPlaying,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsPlaying,
}: Props) {
  const handleSelectTrack = (e: React.MouseEvent, num: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentTrack(num);
    setIsPlaying((prev) => !prev);
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
                onClick={(e) => handleSelectTrack(e, index)}
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
