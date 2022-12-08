import { Icon } from "@iconify/react";
import formatDescriptiveTime from "../utils/formatDescriptiveTime";
import getArtistSummary from "../utils/getArtistSummary";

import styles from "../styles/PlaylistDetail.module.css";

import { SongCollection, Track, TracksMap } from "../types/types";

type Props = {
  tracks: TracksMap;
  currentTrack: Track;
  setShuffleCount: React.Dispatch<React.SetStateAction<number>>;
};

function PlaylistDetail({ tracks, currentTrack, setShuffleCount }: Props) {
  const artists = new Set([...tracks].map(([, track]) => track.artist));
  const artistCount = artists.size;
  const artistSummary = getArtistSummary(artists);
  const trackCount = tracks.size;
  const totalPlaytime = [...tracks]
    .map(([, track]) => track.length)
    .reduce((acc, trackLength) => acc + trackLength, 0);

  const songCollection: SongCollection = {
    title: "Free music beats",
    description: "Chill with a selection of songs from the free music archive",
    tracks,
  };

  const handleShuffle = () => {
    setShuffleCount((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      {/* Album cover */}
      <div className={styles.albumCover}>
        <img alt="Album cover" src={currentTrack.cover} />
      </div>

      <div className={styles.content}>
        <h2>{songCollection.title}</h2>

        {/* Playlist details summary */}
        <div className={styles.summary}>
          <h3>
            {trackCount} Songs &bull; {formatDescriptiveTime(totalPlaytime)}
          </h3>

          <h3>
            {artistCount} Artists: {artistSummary}
          </h3>

          <p>{songCollection.description}</p>
        </div>

        {/* Play controls */}
        <button
          type="button"
          onClick={handleShuffle}
          className={styles.shuffleButton}
        >
          <Icon icon="akar-icons:arrow-shuffle" inline />
          <span>Shuffle</span>
        </button>
      </div>
    </div>
  );
}

export default PlaylistDetail;
