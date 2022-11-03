import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { AudioRef, Track } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
import styles from "../styles/Player.module.css";
import ControlButton from "./ControlButton";
import formatTime from "../utils/formatTime";

interface Props {
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  audioRef: AudioRef;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

type SkipTrackNum = 1 | -1;

function Player({
  audioRef,
  currentTrack,
  setCurrentTrack,
  tracks,
  isPlaying,
  setIsPlaying,
}: Props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [trackLenth, setTrackLength] = useState(0);
  const [playbackError, setPlaybackError] = useState("");

  // References
  const whilePlayingIntervalRef = useRef<number | undefined>();
  const progressBarRef = useRef<HTMLInputElement>(null);

  // Set custom properties to draw playback progress bar
  const updateProgressBar = useCallback(
    (value: number) => {
      const rangeNode = progressBarRef.current;
      if (!rangeNode || !audioRef.current) return;
      const { duration } = audioRef.current;
      if (!Number.isFinite(duration)) return;

      rangeNode.style.setProperty("--value", String(value));
      rangeNode.style.setProperty("--max", String(duration));
    },

    [audioRef]
  );

  const whilePlayingUpdateCurrentTime = useCallback(() => {
    clearInterval(whilePlayingIntervalRef.current);
    whilePlayingIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        updateProgressBar(audioRef.current.currentTime);
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 50);
  }, [audioRef, updateProgressBar]);

  // While playing, updates progress bar
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      whilePlayingUpdateCurrentTime();
    }
    return () => clearInterval(whilePlayingIntervalRef.current);
  }, [isPlaying, audioRef, currentTrack, whilePlayingUpdateCurrentTime]);

  const play = () => {
    audioRef.current
      ?.play()
      .catch(() => setPlaybackError("There was an error during playback"));
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  // fires when onLoadedData
  const handleAutoPlay = () => {
    if (audioRef.current && isPlaying) {
      play();
    }
  };

  // fires when track duration data loaded
  const handleDurationChange = () => {
    if (audioRef.current) {
      const { duration } = audioRef.current;
      setTrackLength(Number.isFinite(duration) ? duration : 0);
    }
  };

  const handleSkiptrack = (num: SkipTrackNum) => {
    const nextSong = currentTrack + num;
    if (nextSong < 0) {
      setCurrentTrack(tracks.length - 1);
    } else if (nextSong >= tracks.length) {
      setCurrentTrack(0);
    } else {
      setCurrentTrack(nextSong);
    }
  };

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying((prev) => !prev);
  };

  // eslint ignore required because callback is not an arrow function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateCurrentTime = useCallback(
    debounce((value: number) => {
      if (!audioRef.current) return;

      // This is expected to mutate
      // eslint-disable-next-line no-param-reassign
      audioRef.current.currentTime = value;

      if (!isPlaying) {
        play();
        setIsPlaying(true);
        whilePlayingUpdateCurrentTime();
      }
    }, 200),
    []
  );

  const handleChangeCurrentTime = (value: number) => {
    clearInterval(whilePlayingIntervalRef.current);
    updateProgressBar(value);
    setCurrentTime(value);
    debouncedUpdateCurrentTime(value);
  };

  return (
    <div className={styles.container}>
      {/* Audio source node */}
      <audio
        onDurationChange={handleDurationChange}
        onLoadedData={handleAutoPlay}
        onEnded={() => handleSkiptrack(1)}
        src={`/${tracks[currentTrack].url}`}
        ref={audioRef}
        preload="metadata"
      >
        <track kind="captions" />
      </audio>

      {/* Error display */}
      {!!playbackError && <div>{playbackError}</div>}

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
          onChange={(e) => handleChangeCurrentTime(Number(e.target.value))}
          className={styles.rangeSlider}
          step="any"
          ref={progressBarRef}
        />
      </div>

      <div className={styles.controlsContainer}>
        {/* Play/Pause button */}
        <ControlButton
          handler={handlePlay}
          action={isPlaying ? "Pause" : "Play"}
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

        {/* Current time / Total time display */}
        <div className={styles.trackTime}>
          <p>{`${formatTime(currentTime)} / ${formatTime(trackLenth)}`}</p>
        </div>

        {/* Track description */}
        <div className={styles.trackInfo}>
          <h3>{tracks[currentTrack].title}</h3>
          <h4>{tracks[currentTrack].artist}</h4>
        </div>
      </div>
    </div>
  );
}

export default Player;
