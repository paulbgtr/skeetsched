import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getScheduledPostByHandle } from "@/app/actions/posts/scheduled-posts";

import LoadingSpinner from "@/components/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScheduledPost } from "./scheduled-post";

export const ScheduledPostsTab = () => {
  const { data: session } = useSession();

  const [handle, setHandle] = useState<string>("");

  useEffect(() => {
    if (!session) {
      return;
    }
    setHandle(session.user.handle);
  }, [session]);

  const { data: posts, isPending } = useQuery({
    queryKey: ["scheduled-posts"],
    queryFn: async () => {
      const drafts = await getScheduledPostByHandle(handle);
      return drafts.sort().reverse();
    },
    enabled: !!handle,
  });

  return (
    <>
      <div className="flex-grow mt-3">
        {isPending && <LoadingSpinner size="sm" />}
        <ScrollArea className="overflow-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {posts?.map((post) => (
              <ScheduledPost
                key={post.id}
                id={post.id}
                content={post.content}
                postAt={post.postAt}
              />
            ))}
          </div>
        </ScrollArea>
        {posts?.length === 0 && (
          <p className="text-sm text-center text-gray-500">
            No scheduled posts found
          </p>
        )}
      </div>
    </>
  );
};
