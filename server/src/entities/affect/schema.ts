import { pgTable, uuid, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { routes } from '../route/schema';
import { occurences } from '../occurrence/schema';
import { boolean } from 'drizzle-orm/mysql-core';

export const affect = pgTable('affect', {
  occurence_id: uuid('occurence_id').references(() => occurences.id).notNull(),
  route_id: varchar('route_id').references(() => routes.id).notNull(),
}, (table) => {
  return {
    pk: [table.occurence_id, table.route_id],
  };
});

export type Affect = InferSelectModel<typeof affect>;
