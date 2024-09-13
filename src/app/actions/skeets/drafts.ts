"use server";

import { eq } from "drizzle-orm";
import db from "@/db";
import { drafts } from "@/db/schema";

export const getDrafts = async () => {
  try {
    return await db.select().from(drafts);
  } catch (err) {
    throw err;
  }
};

export const getDraftsByUserHandle = (handle: string) => {
  try {
    return db.select().from(drafts).where(eq(drafts.userHandle, handle));
  } catch (err) {
    throw err;
  }
};

export const getDraftById = (id: string) => {
  try {
    return db.select().from(drafts).where(eq(drafts.id, id));
  } catch (err) {
    throw err;
  }
};

export const createDraft = async (data: {
  userHandle: string;
  content: string;
}) => {
  try {
    return await db.insert(drafts).values(data).returning();
  } catch (err) {
    throw err;
  }
};

export const deleteDrafts = async (id: string) => {
  try {
    return await db.delete(drafts).where(eq(drafts.id, id));
  } catch (err) {
    throw err;
  }
};

export const updateDrafts = async (
  id: string,
  data: {
    userHandle?: string;
    content?: string;
  }
) => {
  try {
    return await db.update(drafts).set(data).where(eq(drafts.id, id));
  } catch (err) {
    throw err;
  }
};
