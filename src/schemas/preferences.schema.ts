import z from "zod";

const timeFormat = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: "Time must be in HH:MM 24h format",
});

const dndSchema = z.object({
  start: timeFormat,
  end: timeFormat,
});

const eventSettingSchema = z.object({
  enabled: z.boolean(),
});

const eventSettingsSchema = z.record(z.string(), eventSettingSchema);

const preferencesSchema = z.object({
  dnd: dndSchema.optional(),
  eventSettings: eventSettingsSchema,
});

export type PreferencesSchema = z.infer<typeof preferencesSchema>;
