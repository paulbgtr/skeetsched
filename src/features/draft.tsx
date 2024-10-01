import { TrashIcon } from "@radix-ui/react-icons";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { deleteDrafts } from "@/app/actions/skeets/drafts";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";

export const Draft = ({ id, content }: { id: string; content: string }) => {
  const { currentDraftId, setCurrentDraftId } = useCurrentDraftContext();

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  const draftShadow =
    currentDraftId === id ? "shadow-blue-400" : "shadow-gray-300";

  return (
    <div onClick={() => setCurrentDraftId(id)} className="cursor-pointer">
      <div
        className={`flex flex-col pt-2 pl-3 text-sm duration-200 shadow-md h-36 rounded-xl ${draftShadow}`}
      >
        <button
          onClick={() => deleteDraft(id)}
          className="flex items-center self-end justify-center w-6 h-6 mr-3 text-gray-500 duration-200 bg-gray-100 rounded-full hover:bg-gray-300"
        >
          <TrashIcon className="w-4 h-5 text-gray-500" />
        </button>
        <p>
          {content.length >= 1 ? (
            content.slice(0, 100)
          ) : (
            <span className="text-gray-500">Empty draft</span>
          )}
        </p>
      </div>
    </div>
  );
};
