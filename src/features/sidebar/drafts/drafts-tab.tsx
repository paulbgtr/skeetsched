"use client";

import * as React from "react";
import useDrafts from "@/hooks/use-drafts";

import LoadingSpinner from "@/components/loading-spinner";
import { Draft } from "@/features/sidebar/drafts/draft";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DraftsTab = () => {
  const { drafts, isPending, handleCreateDraft } = useDrafts();

  return (
    <>
      <Button
        className="w-full"
        onClick={() => handleCreateDraft()}
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
