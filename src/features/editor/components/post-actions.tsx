import React from "react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import { SchedulePost } from "./schedule-post";

interface PostActionsProps {
  isDisabled: boolean;
  isPendingSchedulePost: boolean;
  isPendingAddPost: boolean;
  onSchedule: (date: Date) => void;
  onPost: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  isDisabled,
  isPendingSchedulePost,
  isPendingAddPost,
  onSchedule,
  onPost,
}) => (
  <div className="flex gap-2">
    <SchedulePost
      isDisabled={isDisabled}
      isPendingSchedulePost={isPendingSchedulePost}
      handleSchedulePost={onSchedule}
    />
    <Button
      onClick={onPost}
      disabled={isDisabled || isPendingAddPost}
      className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
    >
      {isPendingAddPost ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Posting...</span>
        </>
      ) : (
        "Post"
      )}
    </Button>
  </div>
);
