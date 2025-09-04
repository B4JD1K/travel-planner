"use client";

import Image from "next/image";
import Link from "next/link"
import {logout} from "@/lib/auth-actions";
import {Session} from "next-auth";
import {useEffect, useState} from "react";
import Modal from "@/components/ui/modal";
import {LoginForm} from "@/components/ui/LoginForm";

type ProviderIcon = {
  id: string;
  label: string;
  src: string;
};

const providers = [
  {id: "google", label: "Google", src: "/icons/google.svg"},
  {id: "github", label: "GitHub", src: "/icons/github.svg"},
  {id: "facebook", label: "Facebook", src: "/icons/facebook.svg"},
  {id: "linkedin", label: "LinkedIn", src: "/icons/linkedin.svg"},
];

export default function Navbar({session}: { session: Session | null }) {

  const [randomIcon, setRandomIcon] = useState<ProviderIcon | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    const index = Math.floor(Math.random() * providers.length);
    setRandomIcon(providers[index]);
  }, []);

  if (!randomIcon) return null;

  const toggleLoginForm = () => setIsLoginForm(prev => !prev);

  return (
    <nav className="bg-white w-full shadow-md py-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50}/>
          <span className="text-2xl font-bold text-gray-800">Travel Planner</span>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/trips" className="text-slate-900 hover:text-sky-500">
                My Trips
              </Link>
              <Link href="/globe" className="text-slate-900 hover:text-sky-500">
                Globe
              </Link>
              <button onClick={logout} className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-sm cursor-pointer">
                Sign Out
              </button>
            </>
          ) : (
            <Modal open={open} onOpenChange={setOpen}>
              <Modal.Trigger className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white p-2 px-4 rounded-sm cursor-pointer">
                Sign In
                <Image
                  src={randomIcon.src}
                  alt={`Sign in with ${randomIcon.label}`}
                  width={20}
                  height={20}
                  className="ml-2 bg-white rounded-full p-0.5 justify-center items-center"
                />
              </Modal.Trigger>

              <LoginForm isLoginForm={isLoginForm} toggleLoginForm={toggleLoginForm}/>
            </Modal>
          )}
        </div>
      </div>
    </nav>
  );
}
