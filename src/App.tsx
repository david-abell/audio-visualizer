// import { useState } from "react";
import "./App.css";
import useAudioSource from "./useAudioSource";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const source = useAudioSource();
  return (
    <div className="App">
      {
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => source.handlePlay()}
          type="button"
          className="visualizer-container"
        >
          play
        </button>
      }
    </div>
  );
}

export default App;
