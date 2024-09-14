"use client";

import { NewPost } from "@/features/new-post";
import { getDraftById } from "@/app/actions/skeets/drafts";
import LoadingSpinner from "@/components/loading-spinner";
import { useQuery } from "@tanstack/react-query";

export default function Post({ params }: { params: { id: string } }) {
  const { data: draftContent, isPending } = useQuery({
    queryKey: ["drafts", params.id],
    queryFn: () => getDraftById(params.id),
    enabled: !!params.id,
    select: (data) => data[0].content,
  });

  return (
    <main className="flex my-[28vh] justify-center">
      {isPending ? (
        <LoadingSpinner size="sm" />
      ) : (
        <NewPost draftId={params.id} draftContent={draftContent} />
      )}
    </main>
  );
}
