import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { neighborhood } from '../../entities/neighborhood/schema';

export const occurences = pgTable('occurences', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: varchar('description', { length: 255 }).notNull(),
  latitude: varchar('latitude', { length: 255 }).notNull(),
  longitude: varchar('longitude', { length: 255 }).notNull(),
  neighborhoodId: uuid('bairro_id')
    .references(() => neighborhood.id)
    .notNull(),
  confirmed: boolean('confirmed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Occurences = InferSelectModel<typeof occurences>;
