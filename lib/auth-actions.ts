"use server";

import {signIn, signOut} from "@/auth";
import type {ProviderId} from "next-auth/providers";
import {prisma} from "@/lib/prisma";
import {AuthError} from "next-auth";
import bcrypt from "bcrypt";
import {toast} from "sonner";

export type Result<T> = { success: boolean; message: string; data?: T; }

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
    toast.error("Unsupported social provider");

  await signIn(action as ProviderId, {redirectTo: "/trips"});
}

export async function loginWithCredentials(formData: FormData): Promise<Result<null>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    return {
      success: false,
      message: "Missing credentials"
    };

  try {
    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error) {
      if (loginResult.error === "CredentialsSignin") {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      return {
        success: false,
        message: "Authentication failed. Please try again."
      };
    }

    // Login successful
    return {
      success: true,
      message: "Successfully logged in!"
    };

  } catch (e) {
    if (e instanceof AuthError) {
      if (e.type === "CredentialsSignin") {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      return {
        success: false,
        message: "Authentication failed. Please try again."
      };
    }
    console.error("loginWithCredentials message:", e);

    return {
      success: false,
      message: "Internal error occurred. Please try again."
    };
  }
}

export async function registerUser(formData: FormData): Promise<Result<null>> {
  const name = formData.get("name")?.toString();
  const surname = formData.get("surname")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !surname || !email || !password)
    return {success: false, message: "All fields are required"};

  try {
    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser)
      return {success: false, message: "User already exists with this email"};

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: `${name} ${surname}`,
        email,
        passwordHash,
      },
    });

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error)
      return {
        success: false,
        message: "Failed to log in after registration"
      };

    return {
      success: true,
      message: "Account created successfully! Logged in!"
    };
  } catch (e) {
    console.error("registerUser message:", e);

    return {
      success: false,
      message: "Registration failed. Please try again."
    };
  }
}

export async function logout(): Promise<Result<void>> {
  await signOut({redirect: false});

  return {
    success: true,
    message: "Logged out successfully"
  }
}
