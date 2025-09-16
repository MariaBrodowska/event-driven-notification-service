import { Express } from "express";
import { Event } from "../types/event";
import { EventType } from "../types/eventTypes";
import { preferences } from "./preferences.controller";
import { inDND } from "../utils/dndChecker";
import { validateBody } from "../middleware/validation";
import { eventSchema } from "../schemas/event.schema";

export const eventsControllerFactory = (app: Express) => {
  app.post("/events", validateBody(eventSchema), (req, res) => {
    const event: Event = req.body;

    //Manual validation
    // if (!event.eventId || !event.userId || !event.eventType || !event.timestamp)
    //   return res.status(400).json({
    //     message: "eventId, userId, eventType and timestamp are required",
    //   });

    // const allowedEventTypes = Object.values(EventType);
    // if (!allowedEventTypes.includes(event.eventType))
    //   return res.status(400).json({
    //     message: `eventType must be one of: ${allowedEventTypes.join(", ")}`,
    //   });

    // const timestamp = new Date(event.timestamp);
    // if (isNaN(timestamp.getTime()))
    //   return res.status(400).json({
    //     message: "timestamp must be a valid date format",
    //   });

    // const now = new Date();
    // if (timestamp > now)
    //   return res.status(400).json({
    //     message: "timestamp cannot be in the future",
    //   });

    const userPrefs = preferences.get(event.userId);

    if (!userPrefs)
      return res.status(404).json({ message: "User preferences not found" });

    if (!userPrefs.eventSettings[event.eventType].enabled)
      return res.status(200).json({
        decision: "DO_NOT_NOTIFY",
        reason: "USER_UNSUBSCRIBED_FROM_EVENT",
      });

    if (inDND(event.timestamp, userPrefs.dnd))
      return res.status(200).json({
        decision: "DO_NOT_NOTIFY",
        reason: "DND_ACTIVE",
      });

    console.log("Received event:", req.body);
    res.status(202).json({ decision: "PROCESS_NOTIFICATION" });
  });
};
