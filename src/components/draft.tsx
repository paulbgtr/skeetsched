import { TrashIcon } from "@radix-ui/react-icons";
import { useCurrentDraftContext } from "@/context/current-draft-context";
import { deleteDrafts } from "@/app/actions/skeets/drafts";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";

export const Draft = ({ id, content }: { id: string; content: string }) => {
  const { setCurrentDraftId } = useCurrentDraftContext();

  const { mutate: deleteDraft } = useMutation({
    mutationFn: deleteDrafts,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  return (
    <div onClick={() => setCurrentDraftId(id)} className="cursor-pointer">
      <div className="text-sm h-36 duration-200 hover:shadow-blue-300 shadow-md rounded-xl pt-2 pl-3 flex flex-col">
        <button
          onClick={() => deleteDraft(id)}
          className="duration-200 hover:bg-gray-300 flex items-center justify-center w-6 h-6 text-gray-500 bg-gray-100 rounded-full self-end mr-3"
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
