import { v4 as uuidv4 } from "uuid";

import { Track } from "../types/types";

const library: Track[] = [
  {
    title: "Gotham City",
    cover: new URL("../assets/images/covers/TwistedLies.jfif", import.meta.url)
      .href,
    artist: "Audiorezout",
    url: "GothamCity.mp3",
    id: uuidv4(),
    length: 99,
  },
  {
    title: "Hammer War",
    cover: new URL(
      "../assets/images/covers/makeyourownway.jpg",
      import.meta.url
    ).href,
    artist: "Audiorezout",
    url: "Hammerwar.mp3",
    id: uuidv4(),
    length: 147,
  },
  {
    title: "Sailing Away",
    cover: new URL(
      "../assets/images/covers/OrphanedMediaPT2.jfif",
      import.meta.url
    ).href,
    artist: "HoliznaCC0",
    url: "SailingAway.mp3",
    id: uuidv4(),
    length: 157,
  },
  {
    title: "Tuesday",
    cover: new URL("../assets/images/covers/ketsa.jpg", import.meta.url).href,
    artist: "Ketsa",
    url: "Tuesday.mp3",
    id: uuidv4(),
    length: 213,
  },
  {
    title: "Orleans",
    cover: new URL("../assets/images/covers/ketsa.jpg", import.meta.url).href,
    artist: "Ketsa",
    url: "Orleans.mp3",
    id: uuidv4(),
    length: 184,
  },
  {
    title: "Upbeat Funk Pop",
    cover: new URL(
      "../assets/images/covers/scottholmesmusic.jpg",
      import.meta.url
    ).href,
    artist: "Scott Holmes Music",
    url: "UpbeatFunkPop.mp3",
    id: uuidv4(),
    length: 103,
  },
  {
    title: "Epic Cinematic",
    cover: new URL(
      "../assets/images/covers/CinematicBackground.jpg",
      import.meta.url
    ).href,
    artist: "Scott Holmes Music",
    url: "EpicCinematic.mp3",
    id: uuidv4(),
    length: 193,
  },
  {
    title: "French Girls & Cigarettes",
    cover: new URL("../assets/images/covers/streamliner.jpg", import.meta.url)
      .href,
    artist: "Mr Smith",
    url: "FrenchGirls%26Cigarettes.mp3",
    id: uuidv4(),
    length: 133,
  },
  {
    title: "Pursuit Of Life",
    cover: new URL("../assets/images/covers/blueseason3.jpg", import.meta.url)
      .href,
    artist: "Kirk Osamayo",
    url: "PursuitOfLife.mp3",
    id: uuidv4(),
    length: 161,
  },
  {
    title: "Blue Skies",
    cover: new URL("../assets/images/covers/lifeunfolds.jpg", import.meta.url)
      .href,
    artist: "Derek Clegg",
    url: "BlueSkies.mp3",
    id: uuidv4(),
    length: 192,
  },
  {
    title: "Master of the Streats",
    cover: new URL(
      "../assets/images/covers/urbangeneration.jpg",
      import.meta.url
    ).href,
    artist: "Jonas Hipper",
    url: "MasterOfTheStreets.mp3",
    id: uuidv4(),
    length: 133,
  },
  {
    title: "Let's Stay In Love",
    cover: new URL("../assets/images/covers/theyears.jpg", import.meta.url)
      .href,
    artist: "The Years",
    url: "Let'sStayInLove.mp3",
    id: uuidv4(),
    length: 331,
  },
];

const mappedLibary = new Map(library.map((el) => [el.id, el]));

export default mappedLibary;
