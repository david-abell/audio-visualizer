import { AudioRef, Track } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";

interface Props {
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  audioRef: AudioRef;
}

function Player({ audioRef, currentTrack, setCurrentTrack, tracks }: Props) {
  const handleNextTrack = () => {
    setCurrentTrack(1);
  };
  const handlePreviousTrack = () => {
    setCurrentTrack(0);
  };

  return (
    <div>
      <audio
        controls
        src={`/${tracks[currentTrack].url}`}
        ref={audioRef}
        preload="metadata"
      >
        <track kind="captions" />
      </audio>
      <div className={styleUtils.flex}>
        <button
          onClick={handlePreviousTrack}
          type="button"
          disabled={Boolean(currentTrack === 0)}
        >
          Previous Track
        </button>
        <p>Now Playing: {tracks[currentTrack].title}</p>
        <button
          onClick={handleNextTrack}
          type="button"
          disabled={Boolean(currentTrack === tracks.length - 1)}
        >
          Next Track
        </button>
      </div>
    </div>
  );
}

export default Player;
