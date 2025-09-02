"use server";

import {signIn, signOut} from "@/auth";
import type {ProviderId} from "next-auth/providers";

const allowedProviders: ProviderId[] = [
  "google",
  "github",
  "facebook",
  "x",
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

  try {
    return await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (e) {
    throw new Error("Invalid credentials: " + String(e));
  }
}

export async function logout() {
  await signOut({redirectTo: "/"});
}