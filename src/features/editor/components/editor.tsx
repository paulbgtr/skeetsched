"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import useNewPost from "@/hooks/use-new-post";

import { AttachmentActions } from "./attachment-actions";
import { EditorProfile } from "./editor-profile";
import { PostActions } from "./post-actions";
import { PostTextArea } from "./post-text-area";
import { CharacterCounter } from "./character-counter";

const MAX_CONTENT_LENGTH = 300;

export const Editor = () => {
  const {
    content,
    handleContentChange,
    images,
    setImages,
    handleSchedulePost,
    handlePost,
    isPendingSchedulePost,
    isPendingAddPost,
  } = useNewPost();

  const isDisabled =
    content.length === 0 || content.length > MAX_CONTENT_LENGTH;

  return (
    <div className="w-full space-y-3 flex h-[40vh] flex-col max-w-2xl">
      <EditorProfile />

      <div className="flex border-gray-700 rounded-xl border-[1px] flex-col h-full">
        <PostTextArea value={content} onChange={handleContentChange} />
        <AttachmentActions images={images} onSetImages={setImages} />
      </div>

      <div className="flex items-center justify-between mt-2">
        <CharacterCounter current={content.length} max={MAX_CONTENT_LENGTH} />

        <PostActions
          isDisabled={isDisabled}
          isPendingSchedulePost={isPendingSchedulePost}
          isPendingAddPost={isPendingAddPost}
          onSchedule={handleSchedulePost}
          onPost={handlePost}
        />
      </div>
      <Toaster />
    </div>
  );
};
