import { Express } from "express";
import { Event } from "src/types/event";
import { preferences } from "./preferences.controller";

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

    console.log("Received event:", req.body);
    res.status(202).send({ decision: "PROCESS_NOTIFICATION" });
  });
};
