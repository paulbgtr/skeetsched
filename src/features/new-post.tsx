import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import useAgent from "@/hooks/useAgent";
import { createScheduledSkeet } from "@/app/actions/skeets/scheduledSkeets";
import LoadingSpinner from "@/components/loading-spinner";
import { deleteDrafts, updateDrafts } from "@/app/actions/skeets/drafts";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query/client";
import debounce from "lodash.debounce";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export const NewPost = ({
  draftId,
  draftContent,
}: {
  draftId?: string;
  draftContent?: string;
}) => {
  const { toast } = useToast();
  const { agent } = useAgent();
  const router = useRouter();

  const [content, setContent] = useState(draftContent || "");

  const updateDraftContent = async (content: string) => {
    if (!draftId) {
      return;
    }

    await updateDrafts(draftId, { content });
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
    onSuccess: () => cleanUp(),
  });

  const cleanUp = () => {
    queryClient.invalidateQueries({ queryKey: ["drafts"] });
    if (draftId) {
      deleteDraft(draftId);
    }
    router.push("/dashboard/post");
  };

  const { mutate: schedulePost, isPending: isPendingSchedulePost } =
    useMutation({
      mutationFn: createScheduledSkeet,
      onSuccess: () => {
        toast({
          title: "Skeet scheduled",
          description: `Your skeet will be published at the specified time`, // todo: would be better to show the time
        });
        cleanUp();
      },
    });

  const handleSchedulePost = async () => {
    const handle = agent.sessionManager.session.handle;

    try {
      await schedulePost({ userHandle: handle, content, postAt: new Date() });
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

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-xl font-bold mb-4">Compose a Skeet</h1>
      <textarea
        onChange={handleContentChange}
        value={content}
        className="w-full border-2 border-gray-100 p-3 rounded-xl resize-none h-full focus:outline-none"
        placeholder="What's up?"
      />
      <div className="flex justify-between items-center mt-2">
        <span
          className={`${
            content.length < 300 ? "text-gray-500" : "text-red-500"
          }`}
        >
          {content.length}/300
        </span>
        <div className="flex gap-2">
          <Button
            onClick={handleSchedulePost}
            disabled={isDisabled || isPendingSchedulePost}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPendingSchedulePost ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Scheduling...</span>
              </>
            ) : (
              "Schedule"
            )}
          </Button>
          <Button
            onClick={() => addPost()}
            disabled={isDisabled || isPendingAddPost}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
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
