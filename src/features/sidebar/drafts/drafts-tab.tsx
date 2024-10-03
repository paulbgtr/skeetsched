"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDraftsByHandle,
  createDraft,
} from "../../../app/actions/posts/drafts";
import { useSession } from "next-auth/react";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { queryClient } from "@/lib/react-query/client";

import LoadingSpinner from "@/components/loading-spinner";
import { Draft } from "@/features/sidebar/drafts/draft";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DraftsTab = () => {
  const { data: session } = useSession();
  const { setCurrentDraftId } = useCurrentDraftContext();

  const [handle, setHandle] = useState<string>("");

  useEffect(() => {
    if (!session) {
      return;
    }
    setHandle(session.user.handle);
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

  const handleCreateDraft = () => {
    if (handle) {
      createNewDraft({ handle, content: "" });
    }
  };

  return (
    <>
      <Button
        className="w-full"
        onClick={handleCreateDraft}
        variant="secondary"
      >
        New Draft
      </Button>
      <div className="flex-grow mt-3">
        {isPending && <LoadingSpinner size="sm" />}
        <ScrollArea className="overflow-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {drafts?.map((draft) => (
              <Draft key={draft.id} id={draft.id} content={draft.content} />
            ))}
          </div>
        </ScrollArea>
        {drafts?.length === 0 && (
          <p className="text-sm text-center text-gray-500">No drafts found</p>
        )}
      </div>
    </>
  );
};
