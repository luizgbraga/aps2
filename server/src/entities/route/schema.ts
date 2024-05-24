import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';

export const routes = pgTable('routes', {
  id: uuid('route_id').primaryKey(),
  short_name: varchar('short_name', { length: 255 }).notNull(),
  long_name: varchar('long_name', { length: 255 }).notNull(),
  desc: varchar('desc', { length: 255 }),
  type: integer('type').notNull(),
  color: varchar('color', { length: 255 }).notNull(),
  text_color: varchar('text_color', { length: 255 }).notNull(),
});

export type Routes = InferSelectModel<typeof routes>;
