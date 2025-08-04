import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const urls = pgTable('urls', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert; 