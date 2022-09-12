import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM
    }),

  ],
};

export default NextAuth(authOptions);
