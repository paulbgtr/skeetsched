"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDraftsByUserHandle,
  createDraft,
} from "../app/actions/skeets/drafts";
import { useSession } from "next-auth/react";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { queryClient } from "@/lib/react-query/client";

import LoadingSpinner from "@/components/loading-spinner";
import { Draft } from "@/components/draft";
import { Button } from "../components/ui/button";

export default function Sidebar() {
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
      const drafts = await getDraftsByUserHandle(handle);
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
      createNewDraft({ userHandle: handle, content: "" });
    }
  };

  return (
    <aside className="w-64 min-h-screen border-r-[1px] text-gray-800">
      <nav className="flex flex-col p-4">
        <Button onClick={handleCreateDraft} variant="outline">
          New Draft
        </Button>
        <div className="mt-3">
          {isPending && <LoadingSpinner size="sm" />}
          <div className="space-y-2">
            {drafts?.map((draft) => (
              <Draft key={draft.id} id={draft.id} content={draft.content} />
            ))}
          </div>
          {drafts?.length === 0 && (
            <p className="text-sm text-center text-gray-500">No drafts found</p>
          )}
        </div>
      </nav>
    </aside>
  );
}
