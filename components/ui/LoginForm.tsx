import SocialLogin from "@/components/social-login";
import CredentialLoginModal from "@/components/credential-login-modal";
import RegisterModal from "@/components/register-modal";
import Modal from "./modal";

export function LoginForm({isLoginForm}: { isLoginForm?: boolean }) {

  return (
    <div className="flex flex-col mt-4">
      <SocialLogin/>
      {isLoginForm ? (<CredentialLoginModal/>) : (<RegisterModal/>)}
      <div className="px-4 pt-2 w-full justify-center items-center ">
        <Modal.Close className="px-4 py-2 w-full justify-center items-center hover:cursor-pointer rounded text-gray-400 font-medium text-sm hover:text-gray-600">
          Cancel
        </Modal.Close>
      </div>
    </div>
  )
}