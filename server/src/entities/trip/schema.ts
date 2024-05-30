import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';
import { routes } from '../route/schema';

export const trips = pgTable('trips', {
  id: varchar('id').primaryKey(),
  route_id: varchar('route_id').references(() => routes.id),
  headsign: varchar('headsign', { length: 255 }).notNull(),
  direction: integer('direction').notNull(),
});

export type Trips = InferSelectModel<typeof trips>;
