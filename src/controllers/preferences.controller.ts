import { Express } from "express";
import { UserPreferences } from "src/types/preferences";

const preferences = new Map<string, UserPreferences>();

preferences.set("user", {
  dnd: { start: "22:00", end: "07:00" },
  eventSettings: {
    item_shipped: { enabled: true },
    invoice_generated: { enabled: true },
  },
});

export const preferencesControllerFactory = (app: Express) => {
  app.get("/preferences/:userId", (req, res) => {
    // console.log(`Preferences for user ${req.params.userId} requested`);

    const userId = req.params.userId;
    const userPrefs = preferences.get(userId);

    if (!userPrefs)
      return res
        .status(404)
        .send({ message: "No preferences found for this user" });

    res.status(200).send(userPrefs);
  });

  app.post("/preferences/:userId", (req, res) => {
    console.log(`Preferences for user ${req.params.userId} updated`, req.body);

    res.status(200).send({ message: "Hello!" });
  });
};
