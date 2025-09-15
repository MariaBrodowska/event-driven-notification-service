import { Express } from "express";
import { Event } from "../types/event";
import { preferences } from "./preferences.controller";
import { inDND } from "../utils/dndChecker";

export const eventsControllerFactory = (app: Express) => {
  app.post("/events", (req, res) => {
    const event: Event = req.body;
    const userPrefs = preferences.get(event.userId);

    if (!userPrefs)
      return res.status(404).send({ message: "User preferences not found" });

    if (!userPrefs.eventSettings[event.eventType].enabled)
      return res.status(200).send({
        decision: "DO_NOT_NOTIFY",
        reason: "USER_UNSUBSCRIBED_FROM_EVENT",
      });

    if (inDND(event.timestamp, userPrefs.dnd))
      return res.status(200).json({
        decision: "DO_NOT_NOTIFY",
        reason: "DND_ACTIVE",
      });

    console.log("Received event:", req.body);
    res.status(202).send({ decision: "PROCESS_NOTIFICATION" });
  });
};
