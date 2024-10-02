import { useState, useEffect } from "react";
import { createAgent } from "@/lib/bsky/agent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AtpAgent, AtpSessionData } from "@atproto/api";

const useAgent = () => {
  const [agent, setAgent] = useState<AtpAgent | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/");
      return;
    }

    const initializeAgent = async () => {
      try {
        const newAgent = createAgent();

        const atpSession: AtpSessionData = {
          refreshJwt: session.refreshJwt,
          accessJwt: session.accessJwt,
          handle: session.user.handle,
          did: session.user.id,
          active: true,
        };

        try {
          await newAgent.resumeSession(atpSession);
          setAgent(newAgent);
        } catch (error) {
          console.error("Failed to resume session:", error);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to initialize agent:", error);
      }
    };

    initializeAgent();
  }, [router, session, status]);

  return { agent };
};

export default useAgent;
