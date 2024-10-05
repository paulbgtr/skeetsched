import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getDraftsByHandle, createDraft } from "@/app/actions/posts/drafts";
import { queryClient } from "@/lib/react-query/client";
import { useCurrentDraftContext } from "@/context/current-draft-context";

const useDrafts = () => {
  const { data: session } = useSession();
  const { setCurrentDraftId } = useCurrentDraftContext();
  const [handle, setHandle] = useState<string>("");

  useEffect(() => {
    if (session) {
      setHandle(session.user.handle);
    }
  }, [session]);

  const { data: drafts, isPending } = useQuery({
    queryKey: ["drafts"],
    queryFn: async () => {
      const drafts = await getDraftsByHandle(handle);
      return drafts.sort().reverse();
    },
    enabled: !!handle,
  });

  const { mutate: createNewDraft } = useMutation({
    mutationFn: createDraft,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      setCurrentDraftId(data[0].id);
    },
  });

  const handleCreateDraft = (content: string = "") => {
    if (handle) {
      createNewDraft({ handle, content });
    }
  };

  return { drafts, isPending, handleCreateDraft };
};

export default useDrafts;
