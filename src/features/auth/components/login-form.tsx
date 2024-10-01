"use client";

import { AtpSessionData } from "@atproto/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createSession,
  getSessionByHandle,
  updateSessionByHandle,
} from "@/app/actions/skeets/sessions";

export const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard/post");
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

    if (!session) {
      return;
    }

    const atpSession: AtpSessionData = {
      refreshJwt: session?.refreshJwt,
      accessJwt: session?.accessJwt,
      handle: session?.user?.handle,
      did: session?.user?.id,
      active: true,
    };

    const [doesSessionExist] = await getSessionByHandle(handle);

    if (!doesSessionExist) {
      await createSession(atpSession);
    }

    await updateSessionByHandle(atpSession);
    router.push("/dashboard/post");
  };

  return (
    <div className="p-8 shadow-md rounded-xl w-96">
      <h2 className="mb-6 text-3xl font-black text-center">
        Sign in to your Bluesky account
      </h2>
      <form onSubmit={onsubmit}>
        <div className="mb-4">
          <Input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            className="text-gray-600 border-gray-300 rounded-xl"
            placeholder="Handle"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-gray-600 border-gray-300 rounded-xl"
            placeholder="Password"
          />
        </div>
        <Button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
          Login
        </Button>
      </form>
      <div className="mt-4 text-sm italic text-center">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <Link href="https://bsky.app" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
