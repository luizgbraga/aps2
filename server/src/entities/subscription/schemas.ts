import { z } from 'zod';

export const subscribe = z.object({
  neighborhoodId: z.string(),
});
