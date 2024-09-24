import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const scheduledSkeets = pgTable("scheduled_skeets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userHandle: text("user_handle").notNull(),
  content: varchar("content", { length: 300 }).notNull(),
  postAt: timestamp("post_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const drafts = pgTable("drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userHandle: text("user_handle").notNull(),
  content: varchar("content", { length: 300 }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  session: text("session").notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }),
});
