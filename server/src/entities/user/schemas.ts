import { z } from 'zod';

export const register = z.object({
  cpf: z.string().max(255),
  password: z.string().max(255),
});
