"use server";

import { eq } from "drizzle-orm";
import db from "@/db";
import { scheduledPosts } from "@/db/schema";

export const getScheduledPosts = async () => {
  try {
    return await db.select().from(scheduledPosts);
  } catch (err) {
    throw err;
  }
};

export const getScheduledPostByHandle = (handle: string) => {
  try {
    return db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.handle, handle));
  } catch (err) {
    throw err;
  }
};

export const createScheduledPost = async (data: {
  handle: string;
  content: string;
  postAt: Date;
}) => {
  try {
    return await db.insert(scheduledPosts).values(data).returning();
  } catch (err) {
    throw err;
  }
};

export const updateScheduledPost = async (
  id: string,
  data: {
    userHandle: string;
    content: string;
    postAt: Date;
  }
) => {
  try {
    return await db
      .update(scheduledPosts)
      .set(data)
      .where(eq(scheduledPosts.id, id));
  } catch (err) {
    throw err;
  }
};

export const deleteScheduledPost = async (id: string) => {
  try {
    return await db.delete(scheduledPosts).where(eq(scheduledPosts.id, id));
  } catch (err) {
    throw err;
  }
};
