import { useState, useEffect } from "react";
import { createAgent } from "@/lib/bsky/agent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AtpAgent, AtpSessionData } from "@atproto/api";

const useAgent = () => {
  const [agent] = useState<AtpAgent>(createAgent());

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      router.push("/");
    }

    const getAgent = async () => {
      if (agent && session) {
        const atpSession: AtpSessionData = {
          refreshJwt: session?.refreshJwt,
          accessJwt: session?.accessJwt,
          handle: session?.user?.handle,
          did: session?.user?.id,
          active: true,
        };
        agent.sessionManager.session = atpSession;
      }
    };

    getAgent();
  }, [router, session, status, agent]);

  return { agent };
};

export default useAgent;
