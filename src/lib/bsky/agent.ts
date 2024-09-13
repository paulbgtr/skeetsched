import { AtpAgent } from "@atproto/api"; // would be better to swap to Agent as the AtpAgent will be deprecated

export const createAgent = () => {
  return new AtpAgent({
    service: "https://bsky.social",
  });
};
