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

  const startProgressTimer = useCallback(() => {
    clearInterval(trackProgressIntervalRef.current);
    trackProgressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setTrackProgress(audioRef.current.currentTime);
      }
    });
  }, [audioRef]);

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
    debounce((value) => {
      if (!audioRef.current) return;
      // eslint-disable-next-line no-param-reassign
      audioRef.current.currentTime = Number(value);
      if (!isPlaying) {
        audioRef.current.play().catch(() => undefined);
        setIsPlaying(true);
      }
    }, 200),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateRangeProgress = (value: string) => {
    const rangeNode = trackProgressRangeRef.current;
    if (!rangeNode) return;

    const { min, max } = rangeNode;
    const gradientValue =
      (Number(value) - Number(min)) / (Number(max) - Number(min));
    console.log("gradientValue", gradientValue);
    if (Number.isNaN(gradientValue)) return;
    rangeNode.style.backgroundImage = `linear-gradient(to right, green ${gradientValue}%, #fff ${gradientValue}%)`;
    // rangeNode.style.background = [
    //   "linear-gradient(",
    //   "linear, ",
    //   "left top, ",
    //   "right top, ",
    //   `color-stop(${String(gradientValue)}, blue), `,
    //   `color-stop(${String(gradientValue)}, red), `,
    //   ")",
    // ].join("");
    console.log(rangeNode.style.backgroundImage);
  };

  const handleTrackProgress = (value: string) => {
    clearInterval(trackProgressIntervalRef.current);
    const nextValue = Number.isNaN(Number(value)) ? "0" : value;
    setTrackProgress(Number(nextValue));
    // updateRangeProgress(value);
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
          max={audioRef.current ? audioRef.current.duration : "0"}
          value={trackProgress}
          onChange={(e) => handleTrackProgress(e.target.value)}
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
