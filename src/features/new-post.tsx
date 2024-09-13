import { Button } from "@/components/ui/button";
import { useState } from "react";
import useAgent from "@/hooks/useAgent";

export const NewPost = ({ postContent }: { postContent?: string }) => {
  const { agent } = useAgent();

  const [content, setContent] = useState(postContent || "");

  const handleClick = async () => {
    try {
      await agent?.post({
        text: content,
      });

      setContent(""); // todo: add a notification that post was sent
    } catch (err) {
      console.log(err); // todo: handle
    }
  };

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
            onClick={handleClick}
            disabled={content.length === 0 || content.length > 300}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
