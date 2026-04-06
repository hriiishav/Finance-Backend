import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional().default('VIEWER'),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime().optional()
});

export const updateRecordSchema = createRecordSchema.partial();
