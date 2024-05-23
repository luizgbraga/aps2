import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const neighborhood = pgTable('neighborhood', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
});

export type NeighborhoodType = InferSelectModel<typeof neighborhood>;
