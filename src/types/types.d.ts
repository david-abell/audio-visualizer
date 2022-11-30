export type AudioRef = React.RefObject<HTMLAudioElement>;
export type SourceRef = React.MutableRefObject<MediaSource | undefined>;
export type RawData = number[];
export interface LinePath {
  path: string;
  color: string;
  width: number;
}

// export type Track = string;
export interface Track {
  title: string;
  cover: string;
  artist: string;
  url: string;
  id: string;
}

export type TracksMap = Map<string, Track>;

export type TrackFilters = "title" | "artist";

export type FilterBy = keyof Pick<Track, TrackFilters>;

export type RangeRef = React.RefObject<HTMLInputElement>;
