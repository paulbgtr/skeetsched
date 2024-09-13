import { Button } from "@/components/ui/button";
import { useState } from "react";
import useAgent from "@/hooks/useAgent";
import { createScheduledSkeet } from "@/app/actions/skeets/scheduledSkeets";
import LoadingSpinner from "@/components/loading-spinner";

export const NewPost = ({ postContent }: { postContent?: string }) => {
  const { agent } = useAgent();

  const [content, setContent] = useState(postContent || "");
  const [isLoading, setIsLoading] = useState({
    schedule: false,
    post: false,
  });

  const handlePost = async () => {
    try {
      setIsLoading({ ...isLoading, post: true });

      await agent?.post({
        text: content,
      });
    } catch (err) {
      console.log(err); // todo: handle
    } finally {
      setContent(""); // todo: add a notification that post was sent
      setIsLoading({ ...isLoading, post: false });
    }
  };

  const handleSchedule = async () => {
    try {
      setIsLoading({ ...isLoading, schedule: true });

      await createScheduledSkeet({
        userHandle: "paulbg.dev",
        content,
        postAt: new Date(),
      });
    } catch (err) {
      console.log(err); // todo: handle
    } finally {
      setContent(""); // todo: add a notification that post was sent
      setIsLoading({ ...isLoading, schedule: false });
    }
  };

  const isDisabled = content.length === 0 || content.length > 300;

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-xl font-bold mb-4">Compose a Skeet</h1>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="w-full border-2 border-gray-100 p-3 rounded-xl resize-none h-full focus:outline-none"
        placeholder="What's up?"
      />
      <div className="flex justify-between items-center mt-2">
        <span
          className={`${
            content.length < 300 ? "text-gray-500" : "text-red-500"
          }`}
        >
          {content.length}/300
        </span>
        <div className="flex gap-2">
          <Button
            onClick={handleSchedule}
            disabled={isDisabled || isLoading.schedule}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading.schedule ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Scheduling...</span>
              </>
            ) : (
              "Schedule"
            )}
          </Button>
          <Button
            onClick={handlePost}
            disabled={isDisabled || isLoading.post}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            {isLoading.post ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
