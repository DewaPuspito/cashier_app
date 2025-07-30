import { z } from 'zod';

export const transactionSchema = {
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid({ message: "Invalid product ID format" }),
        quantity: z.number().int().positive({ message: "Quantity must be positive" }),
      })
    ).min(1, { message: "At least one product must be added" }),

    paymentType: z.enum(['CASH', 'DEBIT'], {
      required_error: "Payment type is required",
    }),

    cashReceived: z.number().positive({ message: "Cash received must be greater than 0" }).optional(),
    cardNumber: z.string().min(8, { message: "Card number too short" }).
    max(16, { message: "Card number too long" }).optional(),
  }),
  params: z.object({}),
};
