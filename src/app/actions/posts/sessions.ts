"use server";

import { eq } from "drizzle-orm";
import { AtpSessionData } from "@atproto/api";
import db from "@/db";
import { sessions } from "@/db/schema";

export const getSessionByHandle = (handle: string) => {
  try {
    return db.select().from(sessions).where(eq(sessions.handle, handle));
  } catch (err) {
    throw err;
  }
};

export const createSession = async (data: AtpSessionData) => {
  try {
    return await db.insert(sessions).values(data).returning();
  } catch (err) {
    throw err;
  }
};

export const updateSessionByHandle = async (data: AtpSessionData) => {
  try {
    return await db
      .update(sessions)
      .set(data)
      .where(eq(sessions.handle, data.handle));
  } catch (err) {
    throw err;
  }
};

export const deleteSession = async (id: string) => {
  try {
    return await db.delete(sessions).where(eq(sessions.id, id));
  } catch (err) {
    throw err;
  }
};
