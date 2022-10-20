import { Track } from "../types/types";

const library: Track[] = [
  {
    title: "Gotham City",
    cover: new URL("../assets/TwistedLies.jfif", import.meta.url).href,
    artist: "Audiorezout",
    url: "GothamCity.mp3",
  },
  {
    title: "Sailing Away",
    cover: new URL("../assets/OrphanedMediaPT2.jfif", import.meta.url).href,
    artist: "HoliznaCC0",
    url: "SailingAway.mp3",
  },
];

export default library;
