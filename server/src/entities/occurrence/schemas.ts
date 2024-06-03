import { z } from 'zod';

export const propose = z.object({
  type: z.enum(['flooding', 'landslide']),
  description: z.string().max(255),
  neighborhoodId: z.string().uuid(),
  latitude: z.string().max(255),
  longitude: z.string().max(255),
});

export const confirm = z.object({
  id: z.string().uuid(),
});

export const del = z.object({
  id: z.string().uuid(),
});
