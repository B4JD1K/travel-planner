import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {auth} from "@/auth";
import ToastClient from "@/components/ui/ToastClient";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan your trips with ease and confidence.",
};

const providers = [
  {id: "google", label: "Google", src: "/icons/google.svg"},
  {id: "github", label: "GitHub", src: "/icons/github.svg"},
  {id: "discord", label: "Discord", src: "/icons/discord.svg"},
  {id: "linkedin", label: "LinkedIn", src: "/icons/linkedin.svg"},
];

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth();
  const randomIndex = Math.floor(Math.random() * providers.length);
  const randomIcon = providers[randomIndex];

  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <Navbar session={session} randomIcon={randomIcon} />
    {children}
    <ToastClient/>
    </body>
    </html>
  );
}
