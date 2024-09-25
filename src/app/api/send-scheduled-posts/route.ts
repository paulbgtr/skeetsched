import {
  getScheduledSkeets,
  deleteScheduledSkeet,
} from "@/app/actions/skeets/scheduledSkeets";
import { getSessionByHandle } from "../../actions/skeets/sessions";
import { createAgent } from "@/lib/bsky/agent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allSkeets = await getScheduledSkeets();
    const now = new Date();

    const skeets = allSkeets.filter((skeet) => {
      if (!skeet.postAt) return;
      return skeet.postAt <= now;
    });

    if (skeets.length === 0) {
      return new Response("No skeets to post");
    }

    const agent = createAgent();

    try {
      for (const skeet of skeets) {
        const [session] = await getSessionByHandle(skeet.userHandle);
        const bskySession = JSON.parse(session?.session);

        agent.sessionManager.session = bskySession;

        await agent.post({
          text: skeet.content,
        });
        await deleteScheduledSkeet(skeet.id!);
      }
    } catch (err) {
      console.error(err);
      return new Response("Error posting skeets");
    }

    return new Response("Posted skeets");
  } catch (err) {
    console.log(err);
    return new Response("Error posting skeets");
  }
}
