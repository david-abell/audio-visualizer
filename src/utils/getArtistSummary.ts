export default function getArtistSummary(artists: Set<string>) {
  const [artist1, artist2, artist3] = [...artists];
  switch (artists.size) {
    case 0:
      return "None";
    case 1:
      return artist1;
    case 2:
      return `${artist1} and ${artist2}`;
    case 3:
      return `${artist1}, ${artist2}, and ${artist3}`;
    default:
      return `${artist1}, ${artist2}, ${artist3}, and ${
        artists.size - 3
      } others`;
  }
}
