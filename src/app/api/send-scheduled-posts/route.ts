import {
  getScheduledSkeetByUserHandle,
  deleteScheduledSkeet,
} from "@/app/actions/skeets/scheduledSkeets";
import { getSession } from "@/lib/auth/session";
import { createAgent } from "@/lib/bsky/agent";

export const dynamic = "force-dynamic";

export async function GET(req: Request, res: Response) {
  const session = await getSession();

  const bskySession = session?.user?.email;
  const skeets = await getScheduledSkeetByUserHandle(bskySession?.handle);

  if (skeets.length === 0) {
    return new Response("No skeets to post");
  }

  const now = new Date();

  const shouldBePosted = skeets.filter((skeet) => {
    return skeet.postAt!.getTime() <= now.getTime();
  });

  if (shouldBePosted.length === 0) {
    return new Response("No skeets to post");
  }

  const agent = createAgent();
  agent.sessionManager.session = session?.user?.email;

  for (const skeet of shouldBePosted) {
    await agent.post({
      text: skeet.content!,
    });
    await deleteScheduledSkeet(skeet.id);
  }

  return new Response("Posted skeets");
}
