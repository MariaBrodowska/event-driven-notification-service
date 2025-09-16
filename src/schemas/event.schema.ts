import { z } from "zod";
import { EventType } from "../types/eventTypes";

export const eventSchema = z.object({
  eventId: z.string().min(1, "eventId is required"),
  userId: z.string().min(1, "userId is required"),
  eventType: z.enum([EventType.ITEM_SHIPPED, EventType.INVOICE_GENERATED]),
  errorMap: () => ({
    message: "eventType must be 'item_shipped' or 'invoice_generated'",
  }),
  timestamp: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "timestamp must be valid datetime string",
      }
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        return date <= now;
      },
      {
        message: "timestamp cannot be in the future",
      }
    ),
});

export type EventSchema = z.infer<typeof eventSchema>;
