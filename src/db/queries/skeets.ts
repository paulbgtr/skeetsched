import { eq } from "drizzle-orm";
import db from "..";
import { scheduledSkeets } from "../schema";

export const getScheduledSkeets = async () => {
  try {
    return await db.select().from(scheduledSkeets);
  } catch (err) {
    throw err;
  }
};

export const getScheduledSkeetByUserHandle = (handle: string) => {
  try {
    return db
      .select()
      .from(scheduledSkeets)
      .where(eq(scheduledSkeets.userHandle, handle));
  } catch (err) {
    throw err;
  }
};

export const createScheduledSkeet = async (data: {
  userHandle: string;
  content: string;
  postAt: Date;
}) => {
  try {
    return await db.insert(scheduledSkeets).values(data);
  } catch (err) {
    throw err;
  }
};

export const deleteScheduledSkeet = async (id: string) => {
  try {
    return await db.delete(scheduledSkeets).where(eq(scheduledSkeets.id, id));
  } catch (err) {
    throw err;
  }
};

export const updateScheduledSkeet = async (
  id: string,
  data: {
    userHandle: string;
    content: string;
    postAt: Date;
  }
) => {
  try {
    return await db
      .update(scheduledSkeets)
      .set(data)
      .where(eq(scheduledSkeets.id, id));
  } catch (err) {
    throw err;
  }
};
