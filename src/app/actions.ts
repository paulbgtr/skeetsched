"use server";

import jwt from "jsonwebtoken";
import { z } from "zod";

export const login = (formData: FormData) => {
  const schema = z.object({
    identifier: z.string().trim(),
    password: z.string().trim(),
  });

  const userParse = schema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!userParse.success) {
    return {
      error: "Invalid credentials",
    };
  }

  const data = userParse.data;

  try {
    const token = jwt.sign(data, "secret");
    return { token };
  } catch (error) {
    console.log(error);
    return false;
  }
};
