import agent from "@/api/bluesky/agent";
import { me } from "@/app/actions";

export const post = async (content: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const user = await me(token);

  await agent.login({
    identifier: user.identifier,
    password: user.password,
  });

  await agent.post({
    text: content,
  });
};
