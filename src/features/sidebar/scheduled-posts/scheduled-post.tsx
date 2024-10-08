import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";
import { deleteScheduledPost } from "@/app/actions/posts/scheduled-posts";

import { TrashIcon, ImageIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const ScheduledPost = ({
  id,
  content,
  postAt,
  imagesCount,
}: {
  id: string;
  content: string;
  postAt: Date;
  imagesCount?: number;
}) => {
  const { mutate: deletePost } = useMutation({
    mutationFn: deleteScheduledPost,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["scheduled-posts"] }),
  });

  const getContent = () => {
    const maxLength = 75;

    return content.length > maxLength
      ? `${content.slice(0, maxLength)}...`
      : content;
  };

  const getPostAt = () => {
    const date = new Date(postAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const renderImageCounter = () => {
    if (!imagesCount || imagesCount <= 0) return null;
    return (
      <div className="flex items-center text-gray-400">
        <ImageIcon className="w-4 h-4 mr-1" />
        <span className="text-xs">{imagesCount}</span>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-28 px-3 py-3 text-sm duration-200 rounded-xl border-[1px]">
      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 text-gray-500 duration-200 border rounded-full border-gray-700 hover:text-red-400 hover:border-red-400">
            <TrashIcon className="w-4 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription>
              Deleting this post will remove it from your scheduled posts list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => deletePost(id)}
                type="button"
              >
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex-grow">
        {content.length >= 1 ? (
          <p className="text-gray-300">{getContent()}</p>
        ) : (
          <span className="text-gray-400">Empty post</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <time className="text-gray-400 mt-auto">{getPostAt()}</time>
        {renderImageCounter()}
      </div>
    </div>
  );
};
