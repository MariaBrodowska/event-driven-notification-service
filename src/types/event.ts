import { EventType } from "../types/eventTypes";

export interface Event {
  eventId: string;
  userId: string;
  eventType: EventType;
  timestamp: string;
}
