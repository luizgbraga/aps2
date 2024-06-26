import { pgTable, uuid, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { routes } from '../route/schema';
import { occurrences } from '../occurrence/schema';

export const affect = pgTable('affect', {
  occurence_id: uuid('occurence_id').references(() => occurrences.id, { onDelete: 'cascade' }).notNull(),
  route_id: varchar('route_id').references(() => routes.id).notNull(),
}, (table) => {
  return {
    pk: [table.occurence_id, table.route_id],
  };
});

export type Affect = InferSelectModel<typeof affect>;
