export default function formatDescriptiveTime(duration: number) {
  if (!Number.isFinite(duration)) return 0;
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration / 60);

  return duration >= 3600
    ? `${hours} hours, ${minutes} minutes`
    : `${minutes} minutes`;
}
