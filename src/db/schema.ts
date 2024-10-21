import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const scheduledPosts = pgTable("scheduled_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull(),
  content: varchar("content", { length: 300 }).notNull(),
  imageUrls: text("image_urls").array(4).default([]),
  postAt: timestamp("post_at", {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const drafts = pgTable("drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull(),
  content: varchar("content", { length: 300 }).notNull(),
  imageUrls: text("image_urls").array(4).default([]),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accessJwt: text("access_jwt").notNull(),
  refreshJwt: text("refresh_jwt").notNull(),
  handle: text("handle").notNull(),
  did: text("did").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});
