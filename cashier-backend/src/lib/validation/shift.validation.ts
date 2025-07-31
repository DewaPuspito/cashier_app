import { z as zod } from "zod";

export const shiftSchema = {
  body: zod.object({
    startCash: zod.coerce
      .number({ required_error: "Start cash is required" })
      .int("Start cash must be an integer")
      .nonnegative("Start cash cannot be negative"),

    endCash: zod.coerce
      .number()
      .int("End cash must be an integer")
      .nonnegative("End cash cannot be negative")
      .optional(),

    endTime: zod.coerce
      .date()
      .optional(),
  }),

  params: zod.object({
    id: zod.string().uuid("Invalid shift ID format"),
  }),
};
