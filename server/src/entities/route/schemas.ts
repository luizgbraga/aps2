import { z } from 'zod';

export const newRoute = z.object({
  id: z.string().max(255),
  short_name: z.string().max(255),
  long_name: z.string().max(255),
  desc_name: z.string().max(255),
  type: z.number().int(),
  color: z.string().max(255),
  text_color: z.string().max(255),
});

export const login = z.object({
  cpf: z.string().max(255),
  password: z.string().max(255),
});
