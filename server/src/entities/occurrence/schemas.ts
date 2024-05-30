import { z } from 'zod';

export const add = z.object({
  type: z.enum(['flooding', 'landslide']),
  description: z.string().max(255),
  neighborhoodId: z.string().uuid(),
  latitude: z.string().max(255),
  longitude: z.string().max(255),
  radius: z.number().optional(),
  confirmed: z.boolean(),
});

export const confirm = z.object({
  id: z.string().uuid(),
});
