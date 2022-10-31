import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { AudioRef, Track } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
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

  const startProgressTimer = useCallback(() => {
    clearInterval(trackProgressIntervalRef.current);
    trackProgressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
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

  const handleTrackProgress = (value: string) => {
    clearInterval(trackProgressIntervalRef.current);
    setTrackProgress(Number(value));
    debouncedSetCurrentTime(value);
  };

  return (
    <div>
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
      <div className={styleUtils.flex}>
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
        <input
          type="range"
          min="0"
          max={audioRef.current?.duration}
          value={trackProgress}
          onChange={(e) => handleTrackProgress(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Player;
