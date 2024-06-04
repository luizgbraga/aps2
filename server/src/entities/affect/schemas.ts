import { z } from 'zod';

export const affectNewRoute = z.object({
  occurence_id: z.string().max(255),
  route_id: z.string().max(255),
});
