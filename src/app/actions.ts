"use server";

import jwt from "jsonwebtoken";

export const login = (
  previousState: string | undefined | null,
  formData: FormData
) => {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  if (!identifier || !password) {
    return "Invalid credentials";
  }

  const user = {
    identifier: identifier.toString().trim(),
    password: password.toString().trim(),
  };

  const token = jwt.sign(user, "secret");
  return token;
};

export const me = (token: string) => {
  const decoded = jwt.verify(token, "secret");
  const { identifier, password } = decoded as {
    identifier: string;
    password: string;
  };

  return { identifier: identifier.trim(), password: password.trim() };
};
