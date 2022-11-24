import create from "zustand";

type State = {
  currentTime: number;
  trackLength: number;
  playbackError: string;
  volume: number;
  isPlaying: boolean;
  savedVolumeOnMute: number;
  showVolume: boolean;
};

type Action = {
  setCurrentTime: (currentTime: State["currentTime"]) => void;
  setTrackLength: (trackLength: State["trackLength"]) => void;
  setPlaybackError: (playbackError: State["playbackError"]) => void;
  setVolume: (volume: State["volume"]) => void;
  setSavedVolumeOnMute: (volume: State["savedVolumeOnMute"]) => void;
  setIsPlaying: (isPlaying: State["isPlaying"]) => void;
  setShowVolume: (showVolume: State["showVolume"]) => void;
};

const usePlayerStore = create<State & Action>()((set) => ({
  currentTime: 0,
  isPlaying: false,
  isMuted: false,
  playbackError: "",
  trackLength: 0,
  volume: 0.5,
  showVolume: false,
  savedVolumeOnMute: 0.5,
  setCurrentTime: (val) => set(() => ({ currentTime: val })),
  setIsPlaying: (val) => set(() => ({ isPlaying: val })),
  setTrackLength: (val) => set(() => ({ trackLength: val })),
  setPlaybackError: (val) => set(() => ({ playbackError: val })),
  setVolume: (val) => set(() => ({ volume: val })),
  setShowVolume: (val) => set(() => ({ showVolume: val })),
  setSavedVolumeOnMute: (val) => set(() => ({ savedVolumeOnMute: val })),
}));

export default usePlayerStore;
