"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import useAgent from "@/hooks/useAgent";
import { createScheduledSkeet } from "@/app/actions/skeets/scheduledSkeets";
import LoadingSpinner from "@/components/loading-spinner";
import { deleteDrafts, updateDrafts } from "@/app/actions/skeets/drafts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query/client";
import debounce from "lodash.debounce";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { SchedulePost } from "./schedule-post";
import { formatDateForNotification } from "@/lib/utils";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { getDraftById } from "@/app/actions/skeets/drafts";

export const NewPost = () => {
  const { toast } = useToast();
  const { agent } = useAgent();
  const { currentDraftId } = useCurrentDraftContext();

  const [content, setContent] = useState("");

  const { data: draft } = useQuery({
    queryKey: ["draft", currentDraftId],
    queryFn: () => getDraftById(currentDraftId), // todo: fix err
    enabled: !!currentDraftId,
  });

  useEffect(() => {
    if (draft) setContent(draft[0]?.content || "");
  }, [currentDraftId, draft]);

  const updateDraftContent = async (content: string) => {
    if (!currentDraftId) {
      return;
    }

    await updateDrafts(currentDraftId, { content });
    queryClient.invalidateQueries({ queryKey: ["drafts"] });
  };

  const { mutate: updateDraft } = useMutation({
    mutationFn: updateDraftContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  const debouncedSaveDraft = useMemo(
    () =>
      debounce((value) => {
        updateDraft(value);
      }, 500),
    [updateDraft]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    debouncedSaveDraft(e.target.value);
  };

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => cleanUp("drafts"),
  });

  const cleanUp = (key?: string) => {
    key && queryClient.invalidateQueries({ queryKey: [key] });
    if (currentDraftId) {
      deleteDraft(currentDraftId);
    }
    setContent("");
  };

  const { mutate: schedulePost, isPending: isPendingSchedulePost } =
    useMutation({
      mutationFn: createScheduledSkeet,
      onSuccess: ([data]) => {
        const { postAt } = data;

        if (!postAt) {
          return;
        }

        toast({
          title: "Skeet scheduled",
          description: formatDateForNotification(postAt),
        });
        cleanUp("scheduled-posts");
      },
    });

  const handleSchedulePost = async (postAt: Date) => {
    if (!agent?.sessionManager?.session) {
      return;
    }

    const handle = agent.sessionManager.session.handle;

    try {
      schedulePost({ userHandle: handle, content, postAt });
    } catch (err) {
      console.error(err);
    }
  };

  const { mutate: addPost, isPending: isPendingAddPost } = useMutation({
    mutationFn: async () => {
      await agent?.post({
        text: content,
      });
    },
    onSuccess: () => {
      toast({
        title: "Skeet posted",
        description: "Your skeet has been posted",
      });

      cleanUp();
    },
  });

  const isDisabled = content.length === 0 || content.length > 300;
  const isContentTooLong = content.length > 300;

  return (
    <div className="w-full max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Compose a Skeet</h1>
      <textarea
        onChange={handleContentChange}
        value={content}
        className="w-full h-full p-3 border-[1px] border-gray-700 resize-none rounded-xl focus:outline-none bg-transparent"
        placeholder="What's up?"
      />
      <div className="flex items-center justify-between mt-2">
        <span
          className={`${!isContentTooLong ? "text-gray-500" : "text-red-500"}`}
        >
          {isContentTooLong ? 300 - content.length : `${content.length}/300`}
        </span>
        <div className="flex gap-2">
          <SchedulePost
            isDisabled={isDisabled}
            isPendingSchedulePost={isPendingSchedulePost}
            handleSchedulePost={handleSchedulePost}
          />
          <Button
            onClick={() => addPost()}
            disabled={isDisabled || isPendingAddPost}
            className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
          >
            {isPendingAddPost ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </Button>
          <Toaster />
        </div>
      </div>
    </div>
  );
};
