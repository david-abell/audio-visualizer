import { debounce } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useInterval } from "usehooks-ts";
import usePlayerStore from "./usePlayerStore";
import useAudioContext from "./useAudioContext";

import { AudioRef } from "../types/types";

function usePlayer(
  audioRef: AudioRef,
  progressBarRef: React.RefObject<HTMLInputElement>,
  volumeRef: React.RefObject<HTMLInputElement>
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
  const [playerError, setPlayerError] = usePlayerStore(
    (state) => [state.playbackError, state.setPlaybackError],
    shallow
  );
  const [volume, setVolume] = usePlayerStore(
    (state) => [state.volume, state.setVolume],
    shallow
  );
  const [showVolume, setShowVolume] = usePlayerStore(
    (state) => [state.showVolume, state.setShowVolume],
    shallow
  );
  const [savedVolumeOnMute, setSavedVolumeOnMute] = usePlayerStore(
    (state) => [state.savedVolumeOnMute, state.setSavedVolumeOnMute],
    shallow
  );

  const isMuted = volume === 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { audioContext, initAudioContext } = useAudioContext();

  // Store play promises to prevent promise interuption by calls to pause()
  const playPromiseRef = useRef<Promise<void> | undefined>();

  // Set volume at component mount
  useEffect(() => {
    const audioNode = audioRef.current;
    if (!audioNode) return;
    volumeRef.current?.style.setProperty("--value", String(volume * 100));
    audioNode.volume = Number(volume);
  }, [volume, volumeRef, audioRef, showVolume]);

  // Set css custom properties for progress bar
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
  const whilePlaying = () => {
    if (audioRef.current) {
      updateProgressBar(audioRef.current.currentTime);
      setCurrentTime(audioRef.current.currentTime);
      // console.log(current);
    }
  };

  useInterval(whilePlaying, isPlaying ? 60 : null);

  const play = useCallback(() => {
    setIsPlaying(true);
    if (!audioContext || audioContext.state === "closed") {
      initAudioContext();
    }

    playPromiseRef.current = audioRef.current?.play().catch((e) => {
      if (e instanceof Error) {
        setPlayerError(e.message);
      }
    });

    if (audioContext?.state === "suspended") {
      audioContext.resume().catch((e) => {
        if (e instanceof Error) {
          setPlayerError(e.message);
        }
      });
    }
  }, [
    audioContext,
    audioRef,
    initAudioContext,
    setIsPlaying,
    setPlayerError,
    playPromiseRef,
  ]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioContext?.state !== "closed") {
      audioContext?.suspend().catch((e) => {
        if (e instanceof Error) {
          setPlayerError(e.message);
        }
      });
    }
    if (audioRef.current && playPromiseRef.current !== undefined) {
      playPromiseRef.current
        ?.then(() => audioRef.current?.pause())
        .catch((e) => {
          if (e instanceof Error) {
            setPlayerError(e.message);
          }
        });
    } else {
      audioRef.current?.pause();
    }
  }, [audioContext, audioRef, setIsPlaying, setPlayerError, playPromiseRef]);

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
  }, [isPlaying, audioRef, pause, play]);

  // used to play new tracks when audio node event onLoadedData fires
  const handleAutoPlay = () => {
    if (audioContext?.state === "running") return;
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

  function handleVolumeChange(target: string) {
    const { current } = audioRef;
    if (current) {
      current.volume = Number(target);
      volumeRef.current?.style.setProperty("--value", String(volume * 100));
    }
    setVolume(Number(target));
  }

  const toggleIsMuted = () => {
    const currentVolume = volume;
    const savedVolume = savedVolumeOnMute;
    const { current } = audioRef;
    if (!current) return;

    if (isMuted) {
      current.volume = savedVolume;
      volumeRef.current?.style.setProperty(
        "--value",
        String(savedVolume * 100)
      );
      setVolume(savedVolume);
    } else {
      setSavedVolumeOnMute(currentVolume);
      current.volume = 0;
      volumeRef.current?.style.setProperty("--value", String(0));
      setVolume(0);
    }
  };

  // eslint ignore required because callback is not an arrow function
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeAudioTime = useCallback(
    debounce((value: number) => {
      if (!audioRef.current) return;

      const { current } = audioRef;
      current.currentTime = value;
      play();
    }, 100),
    [audioRef, play]
  );

  const handleChangeAudioToTime = (time: number) => {
    if (audioRef.current && playPromiseRef.current !== undefined) {
      playPromiseRef.current
        ?.then(() => audioRef.current?.pause())
        .catch((e) => {
          if (e instanceof Error) {
            setPlayerError(e.message);
          }
        });
    } else {
      audioRef.current?.pause();
    }
    updateProgressBar(time);
    setCurrentTime(time);
    const { current } = audioRef;
    if (current) {
      current.currentTime = time;
    }
    debouncedChangeAudioTime(time);
  };

  const handleClose = () => {
    setShowVolume(false);
    pause();
    audioContext?.close().catch((e) => {
      if (e instanceof Error) {
        setPlayerError(e.message);
      }
    });
  };

  return {
    audioContext,
    currentTime,
    isPlaying,
    playerError,
    trackLength,
    volume,
    showVolume,
    isMuted,
    toggleIsMuted,
    // setCurrentTime,
    // setTrackLength,
    // setPlayerError,
    setIsPlaying,
    handleAutoPlay,
    handleDurationChange,
    handleVolumeChange,
    handleChangeAudioToTime,
    togglePlayPause,
    setShowVolume,
    play,
    pause,
    handleClose,
  };
}
export default usePlayer;
