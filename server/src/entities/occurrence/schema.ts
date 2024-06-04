import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { neighborhood } from '../../entities/neighborhood/schema';
import { doublePrecision } from 'drizzle-orm/pg-core';

export type OccurrenceType = 'flooding' | 'landslide' | 'congestion';

export const occurrences = pgTable('occurrences', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type').$type<OccurrenceType>().notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  latitude: varchar('latitude', { length: 255 }).notNull(),
  longitude: varchar('longitude', { length: 255 }).notNull(),
  radius: doublePrecision('radius').notNull(),
  neighborhoodId: uuid('bairro_id')
    .references(() => neighborhood.id)
    .notNull(),
  confirmed: boolean('confirmed').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Occurrence = InferSelectModel<typeof occurrences>;
