import React, { useState, useEffect } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { deleteDrafts } from "@/app/actions/posts/drafts";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";

export const Draft = ({ id, content }: { id: string; content: string }) => {
  const { currentDraftId, setCurrentDraftId } = useCurrentDraftContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAppearing, setIsAppearing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppearing(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => {
      setIsDeleting(true);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["drafts"] });
        setCurrentDraftId(null);
      }, 300); // Wait for the animation to complete
    },
  });

  const draftBorder =
    currentDraftId === id ? "border-blue-500" : "border-gray-700";

  const getContent = () => {
    const maxLength = 75;

    return content.length > maxLength
      ? `${content.slice(0, maxLength)}...`
      : content;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDraft(id);
  };

  return (
    <div
      onClick={() => setCurrentDraftId(id)}
      className={`cursor-pointer transition-all duration-300 ease-in-out ${
        isDeleting
          ? "opacity-0 scale-95"
          : isAppearing
            ? "opacity-0 scale-95"
            : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`flex flex-col pt-2 pl-3 text-sm duration-200 border-[1px] h-28 rounded-xl ${draftBorder}`}
      >
        <button
          onClick={handleDelete}
          className="flex items-center self-end border-[1px] border-gray-700 justify-center w-6 h-6 mr-3 text-gray-500 duration-200 rounded-full hover:text-red-400 hover:border-red-400"
        >
          <TrashIcon className="w-4 h-5" />
        </button>
        <p>
          {content.length >= 1 ? (
            <p className="text-gray-300">{getContent()}</p>
          ) : (
            <span className="text-gray-400">Empty draft</span>
          )}
        </p>
      </div>
    </div>
  );
};
