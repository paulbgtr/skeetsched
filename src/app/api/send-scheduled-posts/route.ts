import {
  getScheduledSkeets,
  deleteScheduledSkeet,
} from "@/app/actions/skeets/scheduledSkeets";
import { getSessionByHandle } from "../../actions/skeets/sessions";
import { createAgent } from "@/lib/bsky/agent";
import { AtpSessionData } from "@atproto/api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const allSkeets = await getScheduledSkeets();
    const now = new Date();

    const skeetsToPost = allSkeets.filter((skeet) => {
      if (!skeet.postAt) return false;

      const postAtDate = new Date(skeet.postAt);

      const isReady =
        Math.floor(postAtDate.getTime() / 1000) <=
        Math.floor(now.getTime() / 1000);

      console.log(
        `Skeet ID: ${skeet.id}, Content: ${skeet.content.substring(
          0,
          20
        )}..., PostAt: ${postAtDate.toISOString()}, Is Ready: ${isReady}`
      );

      return isReady;
    });

    if (skeetsToPost.length === 0) {
      console.log("No skeets to post");
      return new Response("No skeets to post");
    }

    console.log(`Found ${skeetsToPost.length} skeets to post`);

    const agent = createAgent();

    for (const skeet of skeetsToPost) {
      try {
        const [session] = await getSessionByHandle(skeet.userHandle);

        const { refreshJwt, accessJwt, handle, did } = session;

        const bskySession: AtpSessionData = {
          refreshJwt,
          accessJwt,
          handle,
          did,
          active: true,
        };

        try {
          agent.sessionManager.resumeSession(bskySession);
        } catch (err) {
          return new Response(`Error resuming session, ${err}`);
        }

        console.log(
          `Posting skeet ID: ${skeet.id}, Content: ${skeet.content.substring(
            0,
            20
          )}...`
        );

        await agent.post({
          text: skeet.content,
        });

        await deleteScheduledSkeet(skeet.id!);
        console.log(`Successfully posted and deleted skeet ID: ${skeet.id}`);
      } catch (err) {
        console.error(`Error posting skeet ID: ${skeet.id}`, err);
      }
    }

    return new Response(`Posted ${skeetsToPost.length} skeets`);
  } catch (err) {
    console.error("Error in GET function:", err);
    return new Response("Error posting skeets");
  }
}
