type UnitName = "hour" | "minute";

function formatUnit(num: number, unitName: UnitName) {
  if (num > 1) {
    return `${num} ${unitName}s`;
  }

  if (num === 1) {
    return `${num} ${unitName}`;
  }

  return "";
}

export default function formatDescriptiveTime(seconds: number) {
  const hours = Math.trunc(seconds / 3600);
  const minutes =
    hours > 0
      ? Math.trunc((seconds - hours * 3600) / 60)
      : Math.trunc(seconds / 60);

  const formattedHours = formatUnit(hours, "hour");
  const formattedMinutes = formatUnit(minutes, "minute");

  if (formattedHours || formattedMinutes) {
    return `${formattedHours} ${formattedMinutes}`.trim();
  }
  return "0 minutes";
}
