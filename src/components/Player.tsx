import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { AudioRef, Track } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
import styles from "../styles/Player.module.css";
import ControlButton from "./ControlButton";

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
  const [trackProgress, setTrackProgress] = useState(0);
  const trackProgressIntervalRef = useRef<number | undefined>();
  const trackProgressRangeRef = useRef<HTMLInputElement>(null);

  const updateRangeRefStyle = useCallback(
    (value: number) => {
      const rangeNode = trackProgressRangeRef.current;
      if (!rangeNode || !audioRef.current) return;
      const { duration } = audioRef.current;
      if (!Number.isFinite(duration)) return;

      rangeNode.style.setProperty("--value", String(value));
      rangeNode.style.setProperty("--max", String(duration));
    },

    [audioRef]
  );

  const startProgressTimer = useCallback(() => {
    clearInterval(trackProgressIntervalRef.current);
    trackProgressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        updateRangeRefStyle(audioRef.current.currentTime);
        setTrackProgress(audioRef.current.currentTime);
      }
    });
  }, [audioRef, updateRangeRefStyle]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      startProgressTimer();
    }
    return () => clearInterval(trackProgressIntervalRef.current);
  }, [isPlaying, audioRef, currentTrack, startProgressTimer]);

  const handleAutoPlay = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => undefined);
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
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => undefined);
    }
    setIsPlaying((prev) => !prev);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetCurrentTime = useCallback(
    debounce((value: number) => {
      if (!audioRef.current) return;
      // eslint-disable-next-line no-param-reassign
      audioRef.current.currentTime = value;

      if (!isPlaying) {
        audioRef.current.play().catch(() => undefined);
        setIsPlaying(true);
        startProgressTimer();
      }
    }, 200),
    []
  );

  const handleTrackProgress = (value: number) => {
    clearInterval(trackProgressIntervalRef.current);

    const nextValue =
      Number.isNaN(value) || !Number.isFinite(value) ? 0 : value;
    updateRangeRefStyle(nextValue);
    setTrackProgress(nextValue);
    debouncedSetCurrentTime(nextValue);
  };

  return (
    <div
      className={[
        styleUtils.fullWidth,
        styleUtils.flexCol,
        styleUtils.gap,
      ].join(" ")}
    >
      <audio
        // controls
        onLoadedData={handleAutoPlay}
        onEnded={() => handleSkiptrack(1)}
        src={`/${tracks[currentTrack].url}`}
        ref={audioRef}
        preload="metadata"
      >
        <track kind="captions" />
      </audio>
      <div className={styleUtils.fullWidth}>
        <input
          type="range"
          min="0"
          max={
            audioRef.current && Number.isFinite(audioRef.current.duration)
              ? audioRef.current.duration
              : "100"
          }
          value={trackProgress}
          onChange={(e) => handleTrackProgress(Number(e.target.value))}
          className={styles.rangeSlider}
          step="any"
          ref={trackProgressRangeRef}
        />
      </div>

      <div
        className={[styleUtils.fullWidth, styleUtils.flex, styleUtils.gap].join(
          " "
        )}
      >
        <ControlButton
          handler={handlePlay}
          action={isPlaying ? "Pause" : "Play"}
        />
        <ControlButton
          handler={() => handleSkiptrack(-1)}
          disabled={Boolean(currentTrack === 0)}
          action="Previous"
        />
        <ControlButton
          handler={() => handleSkiptrack(-1)}
          disabled={Boolean(currentTrack === tracks.length - 1)}
          action="Next"
        />
        <p>Now Playing: {tracks[currentTrack].title}</p>
      </div>
    </div>
  );
}

export default Player;
