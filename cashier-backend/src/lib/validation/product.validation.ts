import { z as zod } from "zod";

export const productSchema = {
  body: zod.object({
    name: zod
      .string({ required_error: "Product name is required" })
      .min(1, { message: "Product name must be at least 1 character" })
      .optional(),

    price: zod.coerce
      .number({ required_error: "Price is required" })
      .int({ message: "Price must be a number" })
      .positive({ message: "Price must be greater than zero" })
      .optional(),

    stock: zod.coerce
      .number({ required_error: "Stock is required" })
      .int({ message: "Stock must be a number" })
      .optional(),

    category: zod
     .enum(["FOOD", "DRINK", "CLOTHING", "ELECTRONICS", "HEALTH", "STATIONERY"], {
      required_error: "Category is required",
      invalid_type_error: "Invalid category",
     })
     .optional(),

    imageUrl: zod
     .string({ required_error: "Image URL is required" })
     .url({ message: "Invalid image URL" })
     .optional(),
  }),

  params: zod.object({
    id: zod
      .string({ required_error: "Product ID is required" })
      .uuid({ message: "Invalid product ID format" }),
  }),
};
