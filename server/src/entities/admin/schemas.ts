import { z } from 'zod';

export const login = z.object({
  username: z.string().max(255),
  password: z.string().max(255),
});
