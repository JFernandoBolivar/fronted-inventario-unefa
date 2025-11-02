"use server";
import { signIn } from "@/../auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema, RegisterSchema } from "../src/lib/zod";
import { Role } from "@prisma/client";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    await signIn("credentials", {
      cedula: values.cedula,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const { data, success } = RegisterSchema.safeParse(values);
    if (!success) {
      return { error: "Datos invalidos" };
    }
    // identificar si usuario exite
    const user = await prisma.user.findUnique({
      where: {
        cedula: data.cedula,
      },
    });
    if (user) {
      return { error: "Usuario ya existe" };
    }
    // hashear password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // crear usuario
    await prisma.user.create({
      data: {
        username: data.username,
        cedula: data.cedula,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: hashedPassword,
        role: Role.VENDEDOR,
      },
    });
    await signIn("credentials", {
      cedula: data.cedula,
      password: data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};
