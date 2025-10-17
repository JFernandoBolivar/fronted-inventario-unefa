import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";

import { prisma } from "./src/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.role = user.role;
        token.cedula = user.cedula;
        token.name = user.name;
        token.lastname = user.lastname;
        token.email = user.email;
        token.username = user.username;
        token.phone = user.phone;
        token.address = user.address;
      }
      return token;
    },
    // agregar informacion al token
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.cedula = token.cedula as string;
        session.user.name = token.name as string;
        session.user.lastname = token.lastname as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
        // agrega aquí cualquier otro campo personalizado que tengas en el token
      }
      return session;
    },
  },
});
