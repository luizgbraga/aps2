import { z } from 'zod';

export const check = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
