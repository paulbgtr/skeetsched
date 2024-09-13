"use client";

import { useState, useEffect } from "react";
import { NewPost } from "@/features/new-post";
import { getDraftById } from "@/app/actions/skeets/drafts";
import LoadingSpinner from "@/components/loading-spinner";

export default function Post({ params }: { params: { id: string } }) {
  const [draftContent, setDraftContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const getDraft = async () => {
      const [draft] = await getDraftById(params.id);
      const { content } = draft;

      setDraftContent(content);

      setIsLoading(false);
    };

    getDraft();
  }, [params, draftContent, setDraftContent]);

  return (
    <main className="flex my-[28vh] justify-center">
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <NewPost draftId={params.id} draftContent={draftContent} />
      )}
    </main>
  );
}
