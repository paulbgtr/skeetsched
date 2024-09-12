import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { agent } from "../bsky/agent";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "bsky",
      name: "Bluesky",
      credentials: {
        handle: {
          label: "Handle",
          type: "text",
          placeholder: "handle.bsky.social",
        },
        password: { label: "Password", type: "password" },
      },

      // todo: fix type err
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const result = await agent.login({
          identifier: credentials.handle,
          password: credentials.password,
        });

        if (result.success && agent.session) {
          return {
            id: agent.session?.did,
            name: agent.session?.handle,
            email: agent.session?.email,
            bskySession: agent.session,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;
