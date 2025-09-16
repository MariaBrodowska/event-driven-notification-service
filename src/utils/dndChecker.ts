import { DND } from "../types/preferences";

export function inDND(timestamp: string, dnd?: DND): boolean {
  if (!dnd) return false;

  const eventDate = new Date(timestamp);
  const hours = eventDate.getUTCHours();
  const minutes = eventDate.getUTCMinutes();
  const eventMinutes = hours * 60 + minutes;

  const [startHour, startMinute] = dnd.start.split(":").map(Number);
  const [endHour, endMinute] = dnd.end.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes === endMinutes) return false;

  if (startMinutes < endMinutes) {
    return eventMinutes >= startMinutes && eventMinutes < endMinutes;
  } else {
    //cross midnight
    return eventMinutes >= startMinutes || eventMinutes < endMinutes;
  }
}
