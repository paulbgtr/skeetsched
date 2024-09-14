"use client";

import { Button } from "../components/ui/button";
import {
  createDraft,
  getDraftsByUserHandle,
} from "@/app/actions/skeets/drafts";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { Draft } from "@/components/draft";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query/client";

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const fetchDrafts = async () => {
    const handle = session?.user?.email?.handle;
    return await getDraftsByUserHandle(handle);
  };

  const { data: drafts = [], isPending } = useQuery({
    queryKey: ["drafts"],
    queryFn: fetchDrafts,
  });

  const { mutate } = useMutation({
    mutationFn: createDraft,
    onSuccess: (data) => {
      const [draft] = data;

      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      router.push(`/dashboard/post/${draft.id}`);
    },
  });

  const handleAddDraft = async () => {
    const handle = session?.user?.email?.handle;
    console.log({ handle });

    const content = "";

    await mutate({ content, userHandle: handle });
  };

  return (
    <aside className="w-64 min-h-screen border-r-[1px] text-gray-800">
      <nav className="p-4 flex flex-col">
        <Button onClick={() => handleAddDraft()} variant="ghost">
          New Draft
        </Button>
        <div className="border-t-[1px]">
          <div className="mt-4">
            {isPending ? (
              <LoadingSpinner size="sm" />
            ) : drafts.length > 0 ? (
              <ul className="space-y-2">
                {drafts.map((draft) => (
                  <Draft key={draft.id} id={draft.id} content={draft.content} />
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm italic text-gray-500">
                No drafts found
              </p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
