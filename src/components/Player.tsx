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
  currentTrack: Track;
  handleSetTrack: (id: string) => void;
  audioRef: AudioRef;
  progressBarRef: RangeRef;
  volumeRef: RangeRef;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
  filteredTracks: Track[];
}

function Player({
  audioRef,
  currentTrack,
  handleSetTrack,
  progressBarRef,
  volumeRef,
  setShowPlayer,
  filteredTracks,
}: Props) {
  const {
    currentTime,
    handleAutoPlay,
    handleDurationChange,
    handleChangeAudioToTime,
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
    pause,
  } = usePlayer(audioRef, progressBarRef, volumeRef);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredTrackIds = filteredTracks.map(({ id }) => id);
  const showNextPrevControls = filteredTrackIds.indexOf(currentTrack.id) !== -1;

  // close volume control when clicked away
  useEffect(() => {
    if (!isMobile) return undefined;

    function handleClickOutside(this: Document, e: MouseEvent | TouchEvent) {
      if (
        volumeRef.current &&
        e.target instanceof HTMLElement &&
        !volumeRef.current.contains(e.target)
      ) {
        e.preventDefault();
        setShowVolume(false);
      }
    }
    if (showVolume && volumeRef.current) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [showVolume, setShowVolume, isMobile, volumeRef]);

  const handleShowVolume = () => {
    setShowVolume(!showVolume);
  };

  const handleClosePlayer = () => {
    handleClose();
    setShowPlayer(false);
  };

  const handleNextTrack = () => {
    if (!filteredTrackIds.length) return;
    const firstTrack = filteredTrackIds[0];
    const currentTrackIndex = filteredTrackIds.indexOf(currentTrack.id);
    const isLastTrack = currentTrackIndex + 1 >= filteredTrackIds.length;

    if (currentTrackIndex === -1 || isLastTrack) {
      handleSetTrack(firstTrack);
    } else {
      handleSetTrack(filteredTrackIds[currentTrackIndex + 1]);
    }
  };

  const handlePrevTrack = () => {
    if (!filteredTrackIds.length) return;
    const firstTrack = filteredTrackIds[0];
    const lastTrack = filteredTrackIds.at(-1);

    const currentTrackIndex = filteredTrackIds.indexOf(currentTrack.id);

    if (currentTrackIndex === -1) {
      handleSetTrack(firstTrack);
    } else if (currentTrackIndex === 0 && lastTrack) {
      handleSetTrack(lastTrack);
    } else {
      handleSetTrack(filteredTrackIds[currentTrackIndex - 1]);
    }
  };

  const handleOnEnded = () => {
    if (filteredTrackIds.length) {
      handleNextTrack();
    } else {
      pause();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOnCanPlay = () => {
    handleAutoPlay();
  };

  return (
    <div className={styles.container} data-testid="audio-player">
      {/* Audio source node */}
      <audio
        crossOrigin="anonymous"
        onDurationChange={handleDurationChange}
        onLoadedMetadata={handleDurationChange}
        onEnded={() => handleOnEnded()}
        onCanPlay={handleOnCanPlay}
        src={currentTrack.url}
        ref={audioRef}
        preload="auto"
        autoPlay
        data-testid="audio-node"
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
        <div className={styles.controls}>
          {/* Previous track button */}
          <ControlButton
            handler={handlePrevTrack}
            disabled={Boolean(
              !showNextPrevControls || currentTrack.id === filteredTracks[0]?.id
            )}
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
            handler={handleNextTrack}
            disabled={
              !showNextPrevControls ||
              Boolean(currentTrack.id === filteredTracks.at(-1)?.id)
            }
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

        {/* Current time / Total time display */}
        <div className={styles.trackTime}>
          <p>{formatTime(currentTime)}</p>
          <span>-</span>
          <p>{formatTime(trackLength)}</p>
        </div>

        {/* Track description */}
        {!isMobile && (
          <div className={styles.trackInfo}>
            <h3>{currentTrack.title}</h3>
            <span>-</span>
            <h4>{currentTrack.artist}</h4>
          </div>
        )}

        {/* Close player button */}
        <div className={styles.controlsClose}>
          <button
            type="button"
            onClick={handleClosePlayer}
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
