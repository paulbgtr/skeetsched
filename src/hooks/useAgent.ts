import { useState, useEffect } from "react";
import { Agent } from "@atproto/api";
import { createAgent } from "@/lib/bsky/agent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const useAgent = () => {
  const [agent] = useState<Agent>(createAgent());

  const { data: session, status } = useSession();
  //     {
  //     required: true,
  //     onUnauthenticated() {
  //       router.push("/");
  //     },
  //   }
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    // if (!session?.user) {
    //   router.push("/");
    // }

    const getAgent = async () => {
      if (agent) {
        const bskySession = session?.user?.email;
        // @ts-expect-error returns the handle correctly
        agent.sessionManager.session = bskySession;
      }
    };

    getAgent();
  }, [router, session, status, agent]);

  return { agent };
};

export default useAgent;
