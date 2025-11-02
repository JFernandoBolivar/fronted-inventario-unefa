import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      authorize: async (credentials, req) => {
        const { data, success } = LoginSchema.safeParse(credentials);
        if (!success) {
          throw new Error("credenciales invalidas");
        }
        // verificar usuario
        const user = await prisma.user.findUnique({
          where: {
            cedula: data.cedula,
          },
        });
        if (!user || !user.password) {
          throw new Error("credenciales invalidas");
        }
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
          throw new Error("credenciales invalidas");
        }
        return user;

        // const res = await fetch("http://localhost:3001/api/auth/login", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(data),
        // });
        // const user = await res.json();
        // if (res.ok && user) {
        //   return user;
        // } else {
        //   return null;
        // }
      },
    }),
  ],
} satisfies NextAuthConfig;
