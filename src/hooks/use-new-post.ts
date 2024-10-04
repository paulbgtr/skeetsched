import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import useAgent from "@/hooks/bsky/use-agent";
import { useToast } from "@/hooks/shadcn/use-toast";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { queryClient } from "@/lib/react-query/client";
import { createScheduledPost } from "../app/actions/posts/scheduled-posts";
import {
  deleteDrafts,
  updateDrafts,
  getDraftById,
} from "@/app/actions/posts/drafts";
import { formatDateForNotification } from "@/lib/utils";
import { AtpBaseClient, RichText } from "@atproto/api";

const useNewPost = () => {
  const { toast } = useToast();
  const { agent } = useAgent();
  const { currentDraftId, setCurrentDraftId } = useCurrentDraftContext();
  const [content, setContent] = useState("");

  const { data: draft } = useQuery({
    queryKey: ["draft", currentDraftId],
    queryFn: () => getDraftById(currentDraftId), // todo: fix type err
    enabled: !!currentDraftId,
  });

  useEffect(() => {
    if (draft) setContent(draft[0]?.content || "");
  }, [currentDraftId, draft]);

  const cleanUp = (key?: string) => {
    key && queryClient.invalidateQueries({ queryKey: [key] });
    if (currentDraftId) {
      deleteDraft(currentDraftId);
    }
    setContent("");
  };

  const { mutate: updateDraft } = useMutation({
    mutationFn: async (content: string) => {
      if (!currentDraftId) return;
      await updateDrafts(currentDraftId, { content });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => cleanUp("drafts"),
  });

  const { mutate: schedulePost, isPending: isPendingSchedulePost } =
    useMutation({
      mutationFn: createScheduledPost,
      onSuccess: ([data]) => {
        const { postAt } = data;
        if (!postAt) return;

        toast({
          title: "Skeet scheduled",
          description: formatDateForNotification(postAt),
        });
        cleanUp("scheduled-posts");
      },
    });

  const { mutate: addPost, isPending: isPendingAddPost } = useMutation({
    mutationFn: async () => {
      const rt = new RichText({
        text: content,
      });
      await rt.detectFacets(agent as AtpBaseClient);

      const postRecord = {
        $type: "app.bsky.feed.post",
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
      };

      await agent?.post(postRecord);
      setCurrentDraftId(null);
    },
    onSuccess: () => {
      toast({
        title: "Skeet posted",
        description: "Your skeet has been posted",
      });
      cleanUp();
    },
  });

  const debouncedSaveDraft = useMemo(
    () => debounce((value: string) => updateDraft(value), 500),
    [updateDraft]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSaveDraft(e.target.value);
  };

  const handleSchedulePost = async (postAt: Date) => {
    if (!agent?.sessionManager?.session) return;

    try {
      schedulePost({
        handle: agent.sessionManager.session.handle,
        content,
        postAt,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    content,
    handleContentChange,
    handleSchedulePost,
    handlePost: () => addPost(),
    isPendingSchedulePost,
    isPendingAddPost,
  };
};

export default useNewPost;
