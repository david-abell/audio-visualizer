const formatTimeString = (num: number) => (num < 10 ? `0${num}` : `${num}`);

export default function formatTime(duration: number, noZeros = false) {
  if (!Number.isFinite(duration)) return 0;
  const minutes = Math.trunc(duration / 60);
  const seconds = Math.trunc(duration - minutes * 60);
  if (noZeros) {
    return minutes > 0 ? `${minutes}:${seconds}` : String(seconds);
  }
  return `${formatTimeString(minutes)}:${formatTimeString(seconds)}`;
}
