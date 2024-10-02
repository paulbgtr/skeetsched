import useAgent from "@/hooks/useAgent";
import { useEffect, useState } from "react";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

const useProfile = () => {
  const { agent } = useAgent();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!agent) return;

        const did = agent?.did;

        if (!did) return;

        const { data: bskyProfile } = await agent.getProfile({ actor: did });

        setProfile(bskyProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [agent, profile]);

  return { profile, isLoading };
};

export default useProfile;
