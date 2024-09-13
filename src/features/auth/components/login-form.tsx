"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/post");
    }
  }, [session, router]);

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("bsky", {
      handle,
      password,
      redirect: false,
    });

    if (result?.error) {
      return console.log(result?.error);
    }
    router.push("/post");
  };

  return (
    <div className="rounded-xl shadow-md p-8 w-96">
      <h2 className="text-3xl font-black text-center mb-6">
        Sign in to your Bluesky account
      </h2>
      <form onSubmit={onsubmit}>
        <div className="mb-4">
          <Input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            className="rounded-xl border-gray-300 text-gray-600"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border-gray-300 text-gray-600"
            placeholder="Password"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          Login
        </Button>
      </form>
      <div className="italic text-sm mt-4 text-center">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <Link href="https://bsky.app" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
