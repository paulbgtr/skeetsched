import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAgent } from "../bsky/agent";
import "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    handle: string;
    email: string | null | undefined; // Changed from string | null
    accessJwt: string;
    refreshJwt: string;
  }
  interface Session {
    user: {
      id: string;
      handle: string;
      email: string | null | undefined; // Changed from string | null
    };
    accessJwt: string;
    refreshJwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    handle: string;
    email: string | null | undefined; // Changed from string | null
    accessJwt: string;
    refreshJwt: string;
  }
}

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          return null;
        }
        const agent = createAgent();
        const result = await agent.login({
          identifier: credentials.handle,
          password: credentials.password,
        });
        if (result.success && agent.session) {
          return {
            id: agent.session.did,
            handle: agent.session.handle,
            email: agent.session.email ?? null, // Use nullish coalescing to ensure null instead of undefined
            accessJwt: agent.session.accessJwt,
            refreshJwt: agent.session.refreshJwt,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.handle = user.handle;
        token.email = user.email ?? null; // Use nullish coalescing to ensure null instead of undefined
        token.accessJwt = user.accessJwt;
        token.refreshJwt = user.refreshJwt;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          id: token.id,
          handle: token.handle,
          email: token.email ?? null, // Use nullish coalescing to ensure null instead of undefined
        };
        session.accessJwt = token.accessJwt;
        session.refreshJwt = token.refreshJwt;
      }
      return session;
    },
  },
  secret: "secret",
  pages: {
    signIn: "/login",
  },
};
