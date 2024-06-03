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

export type OccurenceType = 'flooding' | 'landslide' | 'congestion';

export const occurences = pgTable('occurences', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type').$type<OccurenceType>().notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  latitude: varchar('latitude', { length: 255 }).notNull(),
  longitude: varchar('longitude', { length: 255 }).notNull(),
  radius: doublePrecision('radius').notNull(),
  neighborhoodId: uuid('bairro_id')
    .references(() => neighborhood.id)
    .notNull(),
  confirmed: boolean('confirmed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Occurences = InferSelectModel<typeof occurences>;
