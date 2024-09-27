import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAgent } from "../bsky/agent";

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
      // @ts-expect-error runs correctly
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const agent = createAgent();

        const result = await agent.login({
          identifier: credentials.handle,
          password: credentials.password,
        });

        if (result.success && agent.session) {
          const user = {
            email: agent.session,
          };
          return user;
        }
        return null;
      },
    }),
  ],
  secret: "secret",
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;
