"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import useEditor from "@/hooks/use-editor";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import useDrafts from "@/hooks/use-drafts";
import useProfile from "@/hooks/bsky/use-profile";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AttachmentActions } from "./attachment-actions";
import { EditorProfile } from "./editor-profile";
import { PostActions } from "./post-actions";
import { PostTextArea } from "./post-text-area";
import { CharacterCounter } from "./character-counter";
import { PencilIcon } from "lucide-react";

import { useState, useEffect } from "react";

const MAX_CONTENT_LENGTH = 300;

export const Editor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    content,
    handleContentChange,
    images,
    setImages,
    handleSchedulePost,
    handlePost,
    isPendingSchedulePost,
    isPendingAddPost,
  } = useEditor();

  const { profile } = useProfile();

  const { handleCreateDraft } = useDrafts();

  const { currentDraftId } = useCurrentDraftContext();

  const isDisabled =
    (content.length === 0 && images.length === 0) ||
    content.length > MAX_CONTENT_LENGTH;

  useEffect(() => {
    if (currentDraftId) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentDraftId]);

  if (!currentDraftId) {
    return (
      <div className="w-full max-w-md flex justify-center">
        <Button
          onClick={() => handleCreateDraft()}
          className="px-8 py-3 text-base font-medium bg-gradient-to-r from-white via-blue-50 to-blue-100 text-blue-500 hover:text-blue-600 border border-blue-200 rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden group relative shadow-sm hover:shadow-md"
        >
          <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></span>
          <PencilIcon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
          <span className="relative z-10 font-semibold">New draft</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full border-gray-700 rounded-xl border-[1px] space-y-3 flex flex-col max-w-2xl transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 h-[40vh]" : "opacity-0 h-0"
        }`}
      >
        <div className="flex items-center justify-between px-3 pt-3">
          <EditorProfile profile={profile} />

          <PostActions
            isDisabled={isDisabled}
            isPendingSchedulePost={isPendingSchedulePost}
            isPendingAddPost={isPendingAddPost}
            onSchedule={handleSchedulePost}
            onPost={handlePost}
          />
        </div>

        <Separator />

        <PostTextArea value={content} onChange={handleContentChange} />

        <Separator />

        <div className="flex items-center justify-between pb-3 px-1">
          <AttachmentActions images={images} onSetImages={setImages} />
          <CharacterCounter current={content.length} max={MAX_CONTENT_LENGTH} />
        </div>
      </div>
      <Toaster />
    </>
  );
};
