import create from "zustand";

export interface UseAudioContext {
  audioContext: AudioContext | undefined;
  error: string;
  initAudioContext: () => void;
}

const useAudioContext = create<UseAudioContext>()((set) => ({
  audioContext: undefined,
  error: "",
  initAudioContext: () => {
    const context = new AudioContext();
    context
      .resume()
      .then(() => set({ audioContext: context }))
      .catch((e) => set({ error: String(e) }));
  },
}));

export default useAudioContext;
