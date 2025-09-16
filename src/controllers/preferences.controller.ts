import { Express } from "express";
import { UserPreferences } from "../types/preferences";
import { EventType } from "../types/eventTypes";

export const preferences = new Map<string, UserPreferences>();

preferences.set("user1", {
  dnd: { start: "22:00", end: "07:00" },
  eventSettings: {
    [EventType.ITEM_SHIPPED]: { enabled: true },
    [EventType.INVOICE_GENERATED]: { enabled: true },
  },
});

preferences.set("user2", {
  dnd: { start: "21:00", end: "06:00" },
  eventSettings: {
    [EventType.ITEM_SHIPPED]: { enabled: true },
    [EventType.INVOICE_GENERATED]: { enabled: false },
  },
});

export const preferencesControllerFactory = (app: Express) => {
  app.get("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;
    const userPrefs = preferences.get(userId);

    if (!userPrefs)
      return res
        .status(404)
        .json({ message: "No preferences found for this user" });

    console.log(`Preferences for user ${req.params.userId} requested`);
    res.status(200).json(userPrefs);
  });

  app.post("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;
    const userPrefs: UserPreferences = req.body;

    if (!userPrefs || Object.keys(userPrefs).length === 0)
      return res.status(400).json({ message: "Preferences data is required" });

    if (userPrefs.eventSettings) {
      const allowedEventTypes = Object.values(EventType);
      for (const eventType in userPrefs.eventSettings) {
        if (!allowedEventTypes.includes(eventType as EventType))
          return res.status(400).json({
            message: `Unknown event type: ${eventType}. Allowed types: ${allowedEventTypes.join(", ")}`,
          });
      }
    } else
      userPrefs.eventSettings = {
        [EventType.ITEM_SHIPPED]: { enabled: true },
        [EventType.INVOICE_GENERATED]: { enabled: true },
      };

    if (userPrefs.dnd) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (
        !timeRegex.test(userPrefs.dnd.start) ||
        !timeRegex.test(userPrefs.dnd.end)
      )
        return res.status(400).json({
          message: "DND must be a valid HH:MM format",
        });
    }

    const exists = preferences.has(userId);
    preferences.set(userId, userPrefs);

    console.log(
      `Preferences for user ${userId} ${exists ? "updated" : "created"}`,
      req.body
    );

    if (exists)
      return res
        .status(200)
        .json({ message: "Preferences updated", preferences: userPrefs });

    res
      .status(201)
      .json({ message: "Preferences created", preferences: userPrefs });
  });

  app.delete("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;

    if (!preferences.has(userId))
      return res
        .status(404)
        .json({ message: "No preferences found for this user" });

    preferences.delete(userId);

    console.log(`Preferences deleted for user ${req.params.userId}`);
    res.status(200).json({ message: "Preferences deleted" });
  });
};
