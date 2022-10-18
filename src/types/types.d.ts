export type AudioRef = React.RefObject<HTMLAudioElement>;
export type SourceRef = React.MutableRefObject<MediaSource | undefined>;
export type RawData = number[];
export interface LinePath {
  path: string;
  color: string;
  amplitude: number;
}
