const formatTimeString = (num: number) => (num < 10 ? `0${num}` : `${num}`);

export default function formatTime(
  durationInSeconds: number,
  noLeadingMinuteZeros = false
) {
  if (!Number.isFinite(durationInSeconds) || Math.sign(durationInSeconds) !== 1)
    return "00:00";
  const minutes = Math.trunc(durationInSeconds / 60);
  const seconds = Math.trunc(durationInSeconds - minutes * 60);
  if (noLeadingMinuteZeros) {
    return `${minutes}:${formatTimeString(seconds)}`;
  }
  return `${formatTimeString(minutes)}:${formatTimeString(seconds)}`;
}
