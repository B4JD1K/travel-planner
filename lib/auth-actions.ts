"use server";

import {signIn, signOut} from "@/auth";
import type {ProviderId} from "next-auth/providers";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

const allowedProviders: ProviderId[] = [
  "google",
  "github",
  "discord",
  // "facebook",
  "linkedin"
];

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action");

  if (typeof action !== "string" || !allowedProviders.includes(action as ProviderId))
    throw new Error("Unsupported social provider");

  await signIn(action as ProviderId, {redirectTo: "/trips"});
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    throw new Error("Missing credentials");

  return await signIn("credentials", {
    email,
    password,
    redirectTo: "/trips",
  });
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name")?.toString();
  const surname = formData.get("surname")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !surname || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: `${name} ${surname}`,
      email,
      passwordHash,
    },
  });

  // Automatycznie zaloguj po rejestracji
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/trips",
  });
}

export async function logout() {
  await signOut({redirectTo: "/"});
}