import create from "zustand";

type State = {
  currentTime: number;
  trackLength: number;
  playbackError: string;
  volume: number;
  isPlaying: boolean;
};

type Action = {
  setCurrentTime: (currentTime: State["currentTime"]) => void;
  setTrackLength: (trackLength: State["trackLength"]) => void;
  setPlaybackError: (playbackError: State["playbackError"]) => void;
  setVolume: (volume: State["volume"]) => void;
  setIsPlaying: (isPlaying: State["isPlaying"]) => void;
};

const usePlayerStore = create<State & Action>()((set) => ({
  currentTime: 0,
  isPlaying: false,
  playbackError: "",
  trackLength: 0,
  volume: 0.5,
  setCurrentTime: (val) => set(() => ({ currentTime: val })),
  setIsPlaying: (val) => set(() => ({ isPlaying: val })),
  setTrackLength: (val) => set(() => ({ trackLength: val })),
  setPlaybackError: (val) => set(() => ({ playbackError: val })),
  setVolume: (val) => set(() => ({ volume: val })),
}));

export default usePlayerStore;
