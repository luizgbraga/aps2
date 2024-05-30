import { z } from 'zod';

export const newShape = z.object({
  trip_id: z.string().max(255),
  pt_sequence: z.number().int(),
  pt_lat: z.number(),
  pt_lon: z.number(),
  dist_traveled: z.number(),
});
