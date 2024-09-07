import { BskyAgent } from "@atproto/api";

const bskyAgent = new BskyAgent({
  service: "https://bsky.social",
});

export default bskyAgent;
