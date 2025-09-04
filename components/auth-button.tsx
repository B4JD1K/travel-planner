"use client"

import {useRouter} from "next/navigation";
import {useState} from "react";
import {LoginForm} from "@/components/ui/LoginForm";
import Modal from "@/components/ui/modal";

interface AuthButtonProps {
  isLoggedIn: boolean;
  variant?: "hero" | "cta" | "default";
}

export default function AuthButton({isLoggedIn, variant = "default"}: AuthButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleLoginForm = () => setIsLoginForm(prev => !prev);

  const handleClick = async () => {
    if (isLoggedIn) router.push("/trips");
    else setOpen(true);
  }

  const getLabel = () => {
    if (variant === "hero") return isLoggedIn ? "Get Started" : "Log In";
    if (variant === "cta") return isLoggedIn ? "Check It Out" : "Sign Up Now";
    return isLoggedIn ? "Go to Dashboard" : "Login/Register";
  };

  const buttonClass = {
    hero: "border text-white font-semibold cursor-pointer rounded-md py-2 px-6 bg-black hover:bg-gray-800",
    cta: "border font-semibold cursor-pointer rounded-md mt-2 py-2 px-4 bg-white text-black hover:bg-gray-100",
    default: "border px-4 py-2 rounded-md bg-blue-500 text-white",
  }[variant];


  return (
    <>
      <button className={buttonClass} onClick={handleClick}>
        {getLabel()}
      </button>

      {!isLoggedIn && (
        <Modal open={open} onOpenChange={setOpen}>
          <LoginForm isLoginForm={isLoginForm} toggleLoginForm={toggleLoginForm}/>
        </Modal>
      )}
    </>
  );
}