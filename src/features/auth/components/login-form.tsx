"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/app/actions";

export const LoginForm = () => {
  return (
    <div className="rounded-xl shadow-md p-8 w-96">
      <h2 className="text-3xl font-black text-center mb-6">
        Sign in to your Bluesky account
      </h2>
      <form action={login}>
        <div className="mb-4">
          <Input
            id="identifier"
            type="text"
            name="identifier"
            required
            className="rounded-xl border-gray-300 text-gray-600"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <Input
            id="password"
            type="password"
            name="password"
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
