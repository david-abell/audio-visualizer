import { SongCollection, Track, TracksMap } from "../types/types";
import styleUtils from "../styles/styleUtils.module.css";
import formatDescriptiveTime from "../utils/formatDescriptiveTime";
import getArtistSummary from "../utils/getArtistSummary";

type Props = {
  tracks: TracksMap;
  currentTrack: Track;
};

function PlaylistDetail({ tracks, currentTrack }: Props) {
  const artists = new Set([...tracks].map(([, track]) => track.artist));
  const artistCount = artists.size;
  const artistSummary = getArtistSummary(artists);
  const trackCount = tracks.size;
  const totalPlaytime = [...tracks]
    .map(([, track]) => track.length)
    .reduce((acc, trackLength) => acc + trackLength, 0);

  const songCollection: SongCollection = {
    title: "Free music archive selection",
    description: "Chill with a selection of songs from the free music archive",
    tracks,
  };

  return (
    <div>
      <h2>{songCollection.title}</h2>
      <div className={[styleUtils.flex, styleUtils.gap].join(" ")}>
        {/* Album cover */}
        <div>
          <img alt="Album cover" src={currentTrack.cover} />
        </div>

        <div className={[styleUtils.flexCol, styleUtils.gap].join(" ")}>
          {/* Playlist details summary */}
          <div>{trackCount} Songs</div>

          <div>
            {artistCount} Artists: {artistSummary}
          </div>

          <div>Total Playtime: {formatDescriptiveTime(totalPlaytime)}</div>

          <p>{songCollection.description}</p>

          {/* Play controls */}
          <div>
            <button type="button">Shuffle</button>
            <button type="button">Play all</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
