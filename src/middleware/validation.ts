import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: issue.message,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
