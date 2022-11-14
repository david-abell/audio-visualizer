import { debounce } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import usePlayerStore from "./usePlayerStore";
import useAudioContext from "./useAudioContext";

import { AudioRef, Track } from "../types/types";

type SkipTrackNum = 1 | -1;

function usePlayer(
  audioRef: AudioRef,
  progressBarRef: React.RefObject<HTMLInputElement>,
  volumeRef: React.RefObject<HTMLInputElement>,
  tracks: Track[],
  currentTrack: number,
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>
) {
  // Global state values
  const [currentTime, setCurrentTime] = usePlayerStore(
    (state) => [state.currentTime, state.setCurrentTime],
    shallow
  );
  const [isPlaying, setIsPlaying] = usePlayerStore(
    (state) => [state.isPlaying, state.setIsPlaying],
    shallow
  );
  const [trackLength, setTrackLength] = usePlayerStore(
    (state) => [state.trackLength, state.setTrackLength],
    shallow
  );
  const [playbackError, setPlaybackError] = usePlayerStore(
    (state) => [state.playbackError, state.setPlaybackError],
    shallow
  );
  const [volume, setVolume] = usePlayerStore(
    (state) => [state.volume, state.setVolume],
    shallow
  );

  const { audioContext, initAudioContext } = useAudioContext();

  // References
  const whilePlayingIntervalRef = useRef<number | undefined>();

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
    [audioRef, progressBarRef]
  );

  // Interval callback function
  const whilePlaying = useCallback(() => {
    const { current } = whilePlayingIntervalRef;
    // console.log(current);
    clearInterval(current);
    whilePlayingIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        updateProgressBar(audioRef.current.currentTime);
        setCurrentTime(audioRef.current.currentTime);
        // console.log(current);
      }
    }, 50);
  }, [audioRef, setCurrentTime, updateProgressBar]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContext) {
      initAudioContext();
    }
    whilePlaying();
    setIsPlaying(true);
    audioRef.current.play().catch((e) => setPlaybackError(JSON.stringify(e)));
  }, [
    audioContext,
    audioRef,
    initAudioContext,
    setIsPlaying,
    setPlaybackError,
    whilePlaying,
  ]);

  const pause = useCallback(() => {
    const { current } = whilePlayingIntervalRef;
    setIsPlaying(false);
    clearInterval(current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioRef, setIsPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Play / Pause on Spacebar keyboard event
  useEffect(() => {
    const handleKeyup = (event: KeyboardEvent) => {
      if (!audioRef.current || event.code !== "Space") return;
      if (!audioContext) {
        initAudioContext();
      }
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    };

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [audioContext, isPlaying, audioRef, initAudioContext, pause, play]);

  // used to play new tracks when audio node event onLoadedData fires
  const handleAutoPlay = () => {
    if (audioRef.current && isPlaying) {
      play();
    }
  };

  // used when when track duration data from onLoadedMetadata event fires
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

  const handleVolumeChange = (target: string) => {
    const { current } = audioRef;
    if (current) {
      current.volume = Number(target);
      volumeRef.current?.style.setProperty("--value", String(volume * 100));
    }
    setVolume(Number(target));
  };

  // eslint ignore required because callback is not an arrow function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeAudioTime = useCallback(
    debounce((value: number) => {
      if (!audioRef.current) return;

      const { current } = audioRef;
      current.currentTime = value;
      play();
    }, 200),
    [audioContext, audioRef]
  );

  const handleChangeAudioToTime = (value: number) => {
    const { current } = whilePlayingIntervalRef;
    clearInterval(current);
    updateProgressBar(value);
    setCurrentTime(value);
    debouncedChangeAudioTime(value);
  };

  return {
    currentTime,
    isPlaying,
    playbackError,
    trackLength,
    volume,
    // setCurrentTime,
    // setTrackLength,
    // setPlaybackError,
    // setIsPlaying,
    handleAutoPlay,
    handleDurationChange,
    handleSkiptrack,
    handleVolumeChange,
    handleChangeAudioToTime,
    togglePlayPause,
    play,
    pause,
  };
}
export default usePlayer;