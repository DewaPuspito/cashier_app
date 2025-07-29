import { z as zod } from "zod";

export const productSchema = {
  body: zod.object({
    name: zod.string().min(1).optional(),
    price: zod.number().int().positive().optional(),
    stock: zod.number().int().optional(),
  }),
  params: zod.object({
    id: zod.string().uuid(),
  }),
};
