import { Track } from "../types/types";

const library: Track[] = [
  {
    title: "Gotham City",
    cover: new URL("../assets/TwistedLies.jfif", import.meta.url).href,
    artist: "Audiorezout",
    url: "GothamCity.mp3",
  },
  {
    title: "Hammer War",
    cover: new URL("../assets/makeyourownway.jpg", import.meta.url).href,
    artist: "Audiorezout",
    url: "Hammerwar.mp3",
  },
  {
    title: "Sailing Away",
    cover: new URL("../assets/OrphanedMediaPT2.jfif", import.meta.url).href,
    artist: "HoliznaCC0",
    url: "SailingAway.mp3",
  },
  {
    title: "Tuesday",
    cover: new URL("../assets/ketsa.jpg", import.meta.url).href,
    artist: "Ketsa",
    url: "Tuesday.mp3",
  },
  {
    title: "Orleans",
    cover: new URL("../assets/ketsa.jpg", import.meta.url).href,
    artist: "Ketsa",
    url: "Orleans.mp3",
  },
  {
    title: "Tuesday",
    cover: new URL("../assets/scottholmesmusic.jpg", import.meta.url).href,
    artist: "Scott Holmes Music",
    url: "UpbeatFunkPop.mp3",
  },
  {
    title: "Epic Cinematic",
    cover: new URL("../assets/CinematicBackground.jpg", import.meta.url).href,
    artist: "Scott Holmes Music",
    url: "EpicCinematic.mp3",
  },
  {
    title: "French Girls & Cigarettes",
    cover: new URL("../assets/streamliner.jpg", import.meta.url).href,
    artist: "Mr Smith",
    url: "FrenchGirls%26Cigarettes.mp3",
  },
  {
    title: "Pursuit Of Life",
    cover: new URL("../assets/blueseason3.jpg", import.meta.url).href,
    artist: "Kirk Osamayo",
    url: "PursuitOfLife.mp3",
  },
  {
    title: "Blue Skies",
    cover: new URL("../assets/lifeunfolds.jpg", import.meta.url).href,
    artist: "Derek Clegg",
    url: "BlueSkies.mp3",
  },
  {
    title: "Master of the Streats",
    cover: new URL("../assets/urbangeneration.jpg", import.meta.url).href,
    artist: "Jonas Hipper",
    url: "MasterOfTheStreets.mp3",
  },
  {
    title: "Let's Stay In Love",
    cover: new URL("../assets/theyears.jpg", import.meta.url).href,
    artist: "The Years",
    url: "Let'sStayInLove.mp3",
  },
];

export default library;
