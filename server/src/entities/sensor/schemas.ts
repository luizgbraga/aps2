import { z } from 'zod';

export const coordinateSchema = z.object({
  latitude: z.string().regex(/^(-?\d+(\.\d+)?)$/).transform(Number),
  longitude: z.string().regex(/^(-?\d+(\.\d+)?)$/).transform(Number),
});
