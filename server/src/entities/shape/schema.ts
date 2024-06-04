import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { integer, serial } from 'drizzle-orm/pg-core';
import { trips } from '../trip/schema';
import { doublePrecision } from 'drizzle-orm/pg-core';

export const shapes = pgTable('shapes', {
  id: serial('id').primaryKey(),
  trip_id: varchar('trip_id').references(() => trips.id),
  pt_sequence: integer('pt_sequence').notNull(),
  pt_lat: doublePrecision('pt_lat'),
  pt_lon: doublePrecision('pt_lon').notNull(),
  dist_traveled: doublePrecision('dist_traveled').notNull(),
});

export const alt_shapes = pgTable('alt_shapes', {
  id: serial('id').primaryKey(),
  trip_id: varchar('trip_id').references(() => trips.id),
  pt_sequence: integer('pt_sequence').notNull(),
  pt_lat: doublePrecision('pt_lat'),
  pt_lon: doublePrecision('pt_lon').notNull(),
  dist_traveled: doublePrecision('dist_traveled').notNull(),
});

export type Shape = InferSelectModel<typeof shapes>;
export type AltShape = InferSelectModel<typeof alt_shapes>;
