import { AtpAgent } from "@atproto/api";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
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

        const agent = new AtpAgent({
          service: "https://bsky.social",
        });

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
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
