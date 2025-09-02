import {doSocialLogin} from "@/lib/auth-actions";
import Image from "next/image";

const providers = [
  {id: "google", label: "Google"},
  {id: "github", label: "GitHub"},
  {id: "facebook", label: "Facebook"},
  {id: "x", label: "X"},
];

export default function SocialLogin() {
  return (
    <form action={doSocialLogin} className="flex justify-center items-center gap-4 mb-4">
      {providers.map((provider) => (
        <button
          key={provider.id}
          className={`rounded-full justify-center items-center shadow-md p-4 hover:shadow-lg hover:scale-110 transition-all duration-150`}
          type="submit"
          name="action"
          value={provider.id}
        >
          <Image
            src={`/icons/${provider.id}.svg`}
            alt={provider.label}
            width={40}
            height={40}
          />
        </button>
      ))}
    </form>
  );
}
