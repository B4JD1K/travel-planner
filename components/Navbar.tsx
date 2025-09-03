"use client";

import Image from "next/image";
import Link from "next/link"
import {logout} from "@/lib/auth-actions";
import {Session} from "next-auth";
import {useEffect, useState} from "react";
import RegisterModal from "@/components/register-modal";
import {Dialog} from "radix-ui";
import {XIcon} from "lucide-react";
import SocialLogin from "@/components/social-login";
import CredentialLoginModal from "@/components/credential-login-modal";

type ProviderIcon = {
  id: string;
  label: string;
  src: string;
};

const providers = [
  {id: "google", label: "Google", src: "/icons/google.svg"},
  {id: "github", label: "GitHub", src: "/icons/github.svg"},
  {id: "facebook", label: "Facebook", src: "/icons/facebook.svg"},
  {id: "x", label: "X", src: "/icons/x.svg"},
];

export default function Navbar({session}: { session: Session | null }) {

  const [randomIcon, setRandomIcon] = useState<ProviderIcon | null>(null);
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    const index = Math.floor(Math.random() * providers.length);
    setRandomIcon(providers[index]);
  }, []);

  if (!randomIcon) return null;

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
              <button className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-sm cursor-pointer"
                      onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Dialog.Root>
              <Dialog.Trigger className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white p-2 px-4 rounded-sm cursor-pointer">
                Sign In
                <Image
                  src={randomIcon.src}
                  alt={`Sign in with ${randomIcon.label}`}
                  width={20}
                  height={20}
                  className="ml-2 bg-white rounded-full p-0.5 justify-center items-center"
                />
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50
                  data-[state=open]:animate-[dialog-overlay-show_300ms] data-[state=closed]:animate-[dialog-overlay-hide_300ms]">
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-1/2 max-w-md w-full rounded-md bg-white p-8 text-gray-900 shadow
                  data-[state=open]:animate-[dialog-content-show_300ms] data-[state=closed]:animate-[dialog-content-hide_300ms]">
                    <div className="flex justify-between items-center mb-6 text-gray-700">
                      <Dialog.Title className="text-xl font-semibold">
                        {isLoginForm ? "Login " : "Register"}
                      </Dialog.Title>

                      <Dialog.Close className="text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                        <XIcon/>
                      </Dialog.Close>
                    </div>

                    <div className="mt-4">
                      <SocialLogin/>
                    </div>

                    <div className="mt-4">
                      {isLoginForm ? (<CredentialLoginModal/>) : (<RegisterModal/>)}
                    </div>

                    <div className="px-4 py-2 w-full justify-center items-center ">
                      <Dialog.Close className="px-4 py-2 w-full justify-center items-center hover:cursor-pointer rounded text-gray-400 font-medium text-sm hover:text-gray-600">
                        Cancel
                      </Dialog.Close>
                      <button
                        onClick={() => setIsLoginForm(!isLoginForm)}
                        className="px-4 py-2 w-full justify-center  items-center rounded text-gray-400 text-xs hover:text-gray-600 hover:cursor-pointer"
                      >
                        {isLoginForm
                          ? "You don't have an account? Register now!"
                          : "Already have an account? Login now!"
                        }
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Overlay>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
      </div>
    </nav>
  );
}
