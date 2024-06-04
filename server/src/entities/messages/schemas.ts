import { z } from 'zod';

export const list = z.object({
  routeId: z.string(),
});
