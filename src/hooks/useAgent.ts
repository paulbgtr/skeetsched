import { useState, useEffect } from "react";
import { Agent } from "@atproto/api";
import { createAgent } from "@/lib/bsky/agent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const useAgent = () => {
  const [agent, setAgent] = useState<Agent>(createAgent());

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    if (status === "loading") {
      return;
    }

    // if (!session?.user) {
    //   router.push("/");
    // }

    const getAgent = async () => {
      if (agent) {
        agent.sessionManager.session = session?.user?.email;
      }
    };

    getAgent();
  }, [router, session, status, agent]);

  return { agent };
};

export default useAgent;
