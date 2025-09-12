import { Express } from "express";
import { UserPreferences } from "src/types/preferences";

export const preferences = new Map<string, UserPreferences>();

preferences.set("user1", {
  dnd: { start: "22:00", end: "07:00" },
  eventSettings: {
    item_shipped: { enabled: true },
    invoice_generated: { enabled: true },
  },
});

preferences.set("user2", {
  dnd: { start: "21:00", end: "06:00" },
  eventSettings: {
    item_shipped: { enabled: true },
    invoice_generated: { enabled: false },
  },
});

export const preferencesControllerFactory = (app: Express) => {
  app.get("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;
    const userPrefs = preferences.get(userId);

    if (!userPrefs)
      return res
        .status(404)
        .send({ message: "No preferences found for this user" });

    console.log(`Preferences for user ${req.params.userId} requested`);
    res.status(200).send(userPrefs);
  });

  app.post("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;
    const userPrefs: UserPreferences = req.body;

    if (!userPrefs || Object.keys(userPrefs).length === 0)
      return res.status(400).send({ message: "Preferences data is required" });

    if (!userPrefs.eventSettings)
      userPrefs.eventSettings = {
        item_shipped: { enabled: true },
        invoice_generated: { enabled: true },
      };

    preferences.set(userId, userPrefs);

    console.log(`Preferences for user ${req.params.userId} updated`, req.body);
    res
      .status(200)
      .send({ message: "Preferences saved", preferences: userPrefs });
  });

  app.delete("/preferences/:userId", (req, res) => {
    const userId = req.params.userId;

    if (!preferences.has(userId))
      return res
        .status(404)
        .send({ message: "No preferences found for this user" });

    preferences.delete(userId);

    console.log(`Preferences deleted for user ${req.params.userId}`);
    res.status(200).send({ message: "Preferences deleted" });
  });
};
