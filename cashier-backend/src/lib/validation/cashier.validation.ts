import { z } from 'zod';

export const CreateCashierSchema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  params: z.object({})
};

export const UpdateCashierSchema = {
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  }),
  params: z.object({})
};