import { Icon } from "@iconify/react/dist/offline";
import muteIcon from "@iconify/icons-quill/mute";
import soundIcon from "@iconify/icons-quill/sound";
import { AudioRef, Track, RangeRef } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
import styles from "../styles/Player.module.css";
import ControlButton from "./ControlButton";
import formatTime from "../utils/formatTime";
import usePlayer from "../hooks/usePlayer";

interface Props {
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  audioRef: AudioRef;
  progressBarRef: RangeRef;
  volumeRef: RangeRef;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}

function Player({
  audioRef,
  currentTrack,
  setCurrentTrack,
  tracks,
  progressBarRef,
  volumeRef,
  setShowPlayer,
}: Props) {
  const {
    currentTime,
    handleAutoPlay,
    handleDurationChange,
    handleChangeAudioToTime,
    handleSkiptrack,
    handleVolumeChange,
    playerError,
    trackLength,
    togglePlayPause,
    volume,
    isPlaying,
    handleClose,
  } = usePlayer(
    audioRef,
    progressBarRef,
    volumeRef,
    tracks,
    currentTrack,
    setCurrentTrack
  );

  const handleHidePlayer = () => {
    handleClose();
    setShowPlayer(false);
  };

  return (
    <div className={styles.container}>
      {/* Audio source node */}
      <audio
        // crossOrigin="anonymous"
        onDurationChange={handleDurationChange}
        onLoadedData={handleAutoPlay}
        onLoadedMetadata={handleDurationChange}
        onEnded={() => handleSkiptrack(1)}
        src={`/${tracks[currentTrack].url}`}
        ref={audioRef}
        preload="auto"
      >
        <track kind="captions" />
      </audio>

      {/* Error display */}
      {!!playerError && <div>{playerError}</div>}

      {/* Progress bar */}
      <div
        className={[styleUtils.fullWidth, styleUtils.flex, styleUtils.gap].join(
          " "
        )}
      >
        <input
          type="range"
          min="0"
          max={
            audioRef.current && Number.isFinite(audioRef.current.duration)
              ? audioRef.current.duration
              : "100"
          }
          value={currentTime}
          onChange={({ target }) =>
            handleChangeAudioToTime(Number(target.value))
          }
          className={styles.rangeSlider}
          step="any"
          ref={progressBarRef}
        />
      </div>

      <div className={styles.controlsContainer}>
        {/* Play/Pause button */}
        <ControlButton
          handler={togglePlayPause}
          action={isPlaying ? "Pause" : "Play"}
          onKeyup={(e) => e.stopPropagation()}
        />

        {/* Previous track button */}
        <ControlButton
          handler={() => handleSkiptrack(-1)}
          disabled={Boolean(currentTrack === 0)}
          action="Previous"
        />

        {/* Next track button */}
        <ControlButton
          handler={() => handleSkiptrack(-1)}
          disabled={Boolean(currentTrack === tracks.length - 1)}
          action="Next"
        />

        {/* Volume control */}
        <div className={styles.volumeContainer}>
          {volume > 0 ? <Icon icon={soundIcon} /> : <Icon icon={muteIcon} />}
          <input
            type="range"
            onChange={({ target }) => handleVolumeChange(target.value)}
            onClick={({ currentTarget }) =>
              handleVolumeChange(currentTarget.value)
            }
            value={volume}
            min="0"
            max="1"
            step=".01"
            ref={volumeRef}
            className={styles.volumeSlider}
          />
        </div>

        {/* Current time / Total time display */}
        <div className={styles.trackTime}>
          <p>{`${formatTime(currentTime)} / ${formatTime(trackLength)}`}</p>
        </div>

        {/* Track description */}
        <div className={styles.trackInfo}>
          <h3>{tracks[currentTrack].title}</h3>
          <h4>{tracks[currentTrack].artist}</h4>
        </div>
      </div>
      <button type="button" onClick={handleHidePlayer}>
        Close
      </button>
    </div>
  );
}

export default Player;
