"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  createDraft,
  getDraftsByUserHandle,
} from "@/app/actions/skeets/drafts";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { Draft } from "@/components/draft";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState<any[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const handle = session?.user?.email?.handle;

    const getDrafts = async () => {
      setIsLoading(true); // Start loading
      try {
        if (handle) {
          const drafts = await getDraftsByUserHandle(handle);
          setDrafts(drafts);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    getDrafts();
  }, [session]); // Removed drafts from dependency array

  const handleCreateDraft = async () => {
    const handle = session?.user?.email?.handle;

    if (!handle) {
      return;
    }

    // todo: go to blank /dashboard/post
    const [draft] = await createDraft({
      userHandle: handle,
      content: "",
    });
    router.push(`/dashboard/post/${draft.id}`);
  };

  // todo: subscribe to the drafts table so that the sidebar updates when a draft is created

  return (
    <aside className="w-64 min-h-screen border-r-[1px] text-gray-800">
      <nav className="p-4 flex flex-col">
        <Button onClick={handleCreateDraft} variant="ghost">
          New Draft
        </Button>
        <div className="border-t-[1px]">
          <div className="mt-4">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ul className="space-y-2">
                {drafts.map((draft) => (
                  <Draft key={draft.id} id={draft.id} content={draft.content} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
