import { z } from 'zod';

export const getFromName = z.object({
  name: z.string(),
});
