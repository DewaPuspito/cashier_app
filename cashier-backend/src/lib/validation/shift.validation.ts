import { z as zod } from "zod";

export const shiftSchema = {
  body: zod.object({
    startCash: zod.coerce
      .number({ required_error: "Start cash is required" })
      .int("Start cash must be an integer")
      .nonnegative("Start cash cannot be negative")
      .min(1, "Start cash must be at least 1"),

    endCash: zod.coerce
      .number({ required_error: "End cash is required" })
      .int("End cash must be an integer")
      .nonnegative("End cash cannot be negative")
      .min(1, "End cash must be at least 1")
      .optional(),

    endTime: zod.coerce
      .date()
      .optional(),
  }),

  params: zod.object({
    id: zod.string().uuid("Invalid shift ID format"),
  }),
};