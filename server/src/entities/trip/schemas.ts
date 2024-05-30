import { z } from 'zod';

export const newTrip = z.object({
  id: z.string().max(255),
  route_id: z.string().max(255),
  headsign: z.string().max(255),
  direction: z.number().int(),
});
