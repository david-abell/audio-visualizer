import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { AudioRef, Track } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
import styles from "../styles/Player.module.css";
import ControlButton from "./ControlButton";
import formatTime from "../utils/formatTime";
import useAudioContext from "../useAudioContext";
import IconVolume from "./icons/IconVolume";

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
  const [volume, setVolume] = useState(0.8);

  const { audioContext, initAudioContext } = useAudioContext();

  // References
  const whilePlayingIntervalRef = useRef<number | undefined>();
  const progressBarRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

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

  const whilePlaying = useCallback(() => {
    clearInterval(whilePlayingIntervalRef.current);
    whilePlayingIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        updateProgressBar(audioRef.current.currentTime);
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 50);
  }, [audioRef, updateProgressBar]);

  // Updates progress bar and current time while audio is playing,
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      whilePlaying();
    }
    return () => clearInterval(whilePlayingIntervalRef.current);
  }, [isPlaying, audioRef, currentTrack, whilePlaying]);

  // Set audio volume and update volume input
  useEffect(() => {
    if (audioRef.current && volumeRef.current) {
      // eslint-disable-next-line no-param-reassign
      audioRef.current.volume = volume;
      volumeRef.current.style.setProperty("--value", String(volume * 100));
    }
  }, [volume, audioRef, volumeRef]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    setIsPlaying(true);
    audioRef.current.play().catch((e) => setPlaybackError(JSON.stringify(e)));
  }, [audioRef, setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioRef, setIsPlaying]);

  // fired by audio node event onLoadedData
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

  const handleVolume = (target: string) => {
    setVolume(Number(target));
  };

  const handlePlay = useCallback(
    (shouldPause = true) => {
      if (!audioRef.current) return;
      if (!audioContext) {
        initAudioContext();
      }
      if (isPlaying && shouldPause) {
        pause();
      } else {
        play();
      }
    },

    [audioContext, audioRef, isPlaying, pause, play, initAudioContext]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        handlePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePlay]);

  // eslint ignore required because callback is not an arrow function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateCurrentTime = useCallback(
    debounce((value: number) => {
      if (!audioRef.current) return;

      // This is expected to mutate
      // eslint-disable-next-line no-param-reassign
      audioRef.current.currentTime = value;
      handlePlay(false);
      whilePlaying();
    }, 200),
    [audioContext, audioRef.current]
  );

  const handleProgressbarOnChange = (value: number) => {
    clearInterval(whilePlayingIntervalRef.current);
    updateProgressBar(value);
    setCurrentTime(value);
    debouncedUpdateCurrentTime(value);
  };

  return (
    <div className={styles.container}>
      {/* Audio source node */}
      <audio
        // crossOrigin="anonymous"
        // controls
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
          onChange={(e) => handleProgressbarOnChange(Number(e.target.value))}
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

        {/* Volume control */}
        <div className={styles.volumeContainer}>
          <IconVolume />
          <input
            type="range"
            onChange={({ target }) => handleVolume(target.value)}
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
