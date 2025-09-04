import Modal from "./modal";
import SocialLogin from "@/components/social-login";
import CredentialLoginModal from "@/components/credential-login-modal";
import RegisterModal from "@/components/register-modal";
import {InfoIcon} from "lucide-react";
import {Tooltip} from "radix-ui";

type AuthModalContentProps = {
  isLoginForm: boolean;
  toggleLoginForm: () => void;
};

export function LoginForm({isLoginForm, toggleLoginForm}: AuthModalContentProps) {
  return (
    <Modal.Content title={isLoginForm ? "Login" : "Register"}>
      {isLoginForm &&
        <Modal.Description className="flex justify-end items-center">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <InfoIcon aria-describedby="asfasd" className="w-3 h-3 opacity-50 -mt-8 mr-1.5"/>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content className="p-2 bg-white shadow-sm text-gray-300 opacity-80 rounded-md -translate-x-1/3" sideOffset={4} side="bottom">
                  <p className="text-xs">tester@email.com</p>
                  <p className="text-xs">password</p>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Modal.Description>
      }

      <div className="flex flex-col mt-4">
        <SocialLogin/>
        {isLoginForm ? (<CredentialLoginModal/>) : (<RegisterModal/>)}
        <div className="px-4 pt-2 w-full justify-center items-center ">
          <Modal.Close className="px-4 py-2 w-full justify-center items-center hover:cursor-pointer rounded text-gray-400 font-medium text-sm hover:text-gray-600">
            Cancel
          </Modal.Close>
        </div>
      </div>

      <button
        onClick={toggleLoginForm}
        className="px-4 py-2 w-full justify-center items-center rounded text-gray-400 text-xs hover:text-gray-600 hover:cursor-pointer"
      >
        {isLoginForm
          ? "You don't have an account? Register now!"
          : "Already have an account? Login now!"}
      </button>
    </Modal.Content>
  )
}