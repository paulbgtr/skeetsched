import {
  getScheduledPosts,
  deleteScheduledPost,
} from "@/app/actions/posts/scheduled-posts";
import { getSessionByHandle } from "../../actions/posts/sessions";
import { createAgent } from "@/lib/bsky/agent";
import { AtpSessionData } from "@atproto/api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const allPosts = await getScheduledPosts();
    const now = new Date();

    const postsToPost = allPosts.filter((post) => {
      if (!post.postAt) return false;

      const postAtDate = new Date(post.postAt);

      const isReady =
        Math.floor(postAtDate.getTime() / 1000) <=
        Math.floor(now.getTime() / 1000);

      console.log(
        `Skeet ID: ${post.id}, Content: ${post.content.substring(
          0,
          20
        )}..., PostAt: ${postAtDate.toISOString()}, Is Ready: ${isReady}`
      );

      return isReady;
    });

    if (postsToPost.length === 0) {
      console.log("No skeets to post");
      return new Response("No skeets to post");
    }

    console.log(`Found ${postsToPost.length} skeets to post`);

    const agent = createAgent();

    for (const post of postsToPost) {
      try {
        const [session] = await getSessionByHandle(post.handle);

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
          `Posting skeet ID: ${post.id}, Content: ${post.content.substring(
            0,
            20
          )}...`
        );

        await agent.post({
          text: post.content,
        });

        await deleteScheduledPost(post.id);
        console.log(`Successfully posted and deleted skeet ID: ${post.id}`);
      } catch (err) {
        console.error(`Error posting skeet ID: ${post.id}`, err);
      }
    }

    return new Response(`Posted ${postsToPost.length} skeets`);
  } catch (err) {
    console.error("Error in GET function:", err);
    return new Response("Error posting skeets");
  }
}
