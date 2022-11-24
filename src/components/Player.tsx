import { useEffect } from "react";
import { Icon } from "@iconify/react/dist/offline";
import muteIcon from "@iconify/icons-quill/mute";
import soundIcon from "@iconify/icons-quill/sound";
import escapeIcon from "@iconify/icons-quill/escape";
import { useMediaQuery } from "usehooks-ts";

import styleUtils from "../styles/styleUtils.module.css";
import styles from "../styles/Player.module.css";
import ControlButton from "./ControlButton";
import formatTime from "../utils/formatTime";
import usePlayer from "../hooks/usePlayer";

import { AudioRef, Track, RangeRef } from "../types/types";

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
    showVolume,
    setShowVolume,
    isPlaying,
    handleClose,
    isMuted,
    toggleIsMuted,
  } = usePlayer(
    audioRef,
    progressBarRef,
    volumeRef,
    tracks,
    currentTrack,
    setCurrentTrack
  );

  const isMobile = useMediaQuery("(max-width: 768px)");

  // close volume control when clicked away
  useEffect(() => {
    if (!isMobile) return undefined;

    function handleClickOutside(this: Document, e: MouseEvent) {
      if (
        volumeRef.current &&
        e.target instanceof HTMLElement &&
        !volumeRef.current.contains(e.target)
      ) {
        setShowVolume(false);
      }
    }
    if (showVolume && volumeRef.current) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showVolume, setShowVolume, isMobile, volumeRef]);

  const handleShowVolume = () => {
    setShowVolume(!showVolume);
  };

  const handleClosePlayer = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleClose(e);
    setShowPlayer(false);
  };

  return (
    <div className={styles.container}>
      {/* Audio source node */}
      <audio
        crossOrigin="anonymous"
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
        {/* Left control group */}
        <div className={styles.controlsLeft}>
          {/* Previous track button */}
          <ControlButton
            handler={() => handleSkiptrack(-1)}
            disabled={Boolean(currentTrack === 0)}
            action="Previous"
          />

          {/* Play/Pause button */}
          <ControlButton
            handler={togglePlayPause}
            action={isPlaying ? "Pause" : "Play"}
            onKeyup={(e) => e.stopPropagation()}
          />

          {/* Next track button */}
          <ControlButton
            handler={() => handleSkiptrack(-1)}
            disabled={Boolean(currentTrack === tracks.length - 1)}
            action="Next"
          />

          {/* Volume control */}
          <div className={styles.volumeContainer}>
            {/* mobile volume control toggles slider */}
            {isMobile && (
              <>
                {showVolume && (
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
                )}
                <button
                  type="button"
                  className={styles.mobileVolume}
                  onClick={handleShowVolume}
                >
                  {!isMuted ? (
                    <Icon icon={soundIcon} />
                  ) : (
                    <Icon icon={muteIcon} />
                  )}
                </button>
              </>
            )}
            {/* large screen volume control toggles mute */}
            {!isMobile && (
              <>
                <button type="button" onClick={toggleIsMuted}>
                  {!isMuted ? (
                    <Icon icon={soundIcon} />
                  ) : (
                    <Icon icon={muteIcon} />
                  )}
                </button>
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
              </>
            )}
          </div>
        </div>

        <div className={styles.controlsCenter}>
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

        {/* Right control group */}
        <div className={styles.controlsRight}>
          {/* Close player button */}
          <button
            type="button"
            onClick={(e) => handleClosePlayer(e)}
            area-label="Close"
            className={styles.button}
          >
            <Icon icon={escapeIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Player;
