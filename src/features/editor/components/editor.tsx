"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import useNewPost from "@/hooks/use-new-post";

import { Separator } from "@/components/ui/separator";
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
    (content.length === 0 && images.length === 0) ||
    content.length > MAX_CONTENT_LENGTH;

  return (
    <>
      <div className="w-full border-gray-700 rounded-xl border-[1px] space-y-3 flex h-[40vh] flex-col max-w-2xl">
        <div className="flex items-center justify-between px-3 pt-3">
          <EditorProfile />

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
