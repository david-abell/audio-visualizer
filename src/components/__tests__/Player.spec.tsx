import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Player from "../Player";

const track1 = {
  title: "title 1",
  cover: new URL("../assets/images/covers/TwistedLies.jfif", import.meta.url)
    .href,
  artist: "Artist 1",
  url: "GothamCity.mp3",
  id: "id1",
  length: 99,
};

const track2 = {
  title: "title 2",
  cover: new URL("../assets/images/covers/TwistedLies.jfif", import.meta.url)
    .href,
  artist: "Artist 2",
  url: "GothamCity.mp3",
  id: "id2",
  length: 299,
};

const tracks = [track1, track2];

test("should render a player", async () => {
  const audioRef = {
    current: document.createElement("audio"),
  };
  const volumeRef = {
    current: document.createElement("input"),
  };
  const progressRef = {
    current: document.createElement("input"),
  };

  const player = (
    <Player
      audioRef={audioRef}
      currentTrack={track1}
      volumeRef={volumeRef}
      filteredTracks={tracks}
      handleSetTrack={() => undefined}
      setShowPlayer={() => undefined}
      progressBarRef={progressRef}
    />
  );

  render(player);

  const element = screen.getByTestId("audio-player");

  expect(element).toBeTruthy();
});
