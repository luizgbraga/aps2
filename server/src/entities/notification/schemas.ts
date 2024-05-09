import { z } from 'zod';

export const add = z.object({
  description: z.string().max(255),
  neighborhoodId: z.string().uuid(),
});
