import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const scheduledSkeets = pgTable("scheduled_skeets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userHandle: text("user_handle").notNull(),
  content: varchar("content", { length: 300 }).notNull(),
  postAt: timestamp("post_at", {
    withTimezone: true,
  }).notNull(),
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
  refreshJwt: text("refresh_jwt").notNull(),
  accessJwt: text("access_jwt").notNull(),
  handle: text("handle").notNull(),
  did: text("did").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});
