"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Agent } from "@atproto/api";
import { createAgent } from "@/lib/bsky/agent";
import { useRouter } from "next/navigation";

export default function Post() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [agent, setAgent] = useState<Agent | null>(createAgent());

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      router.push("/");
    }

    const getAgent = async () => {
      if (agent) {
        agent.sessionManager.session = session?.user?.email;
      }
    };

    getAgent();
  }, [router, session, status, agent]);

  const handleClick = async () => {
    try {
      await agent?.post({
        text: content,
      });

      setContent(""); // todo: add notification that post was sent
    } catch (err) {
      console.log(err); // todo: handle
    }
  };

  return (
    <main className="flex my-[28vh] justify-center">
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
              disabled={content.length === 0 || content.length > 300}
              className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
            >
              Save as draft
            </Button>
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
    </main>
  );
}
