import {loginWithCredentials} from "@/lib/auth-actions";

export default function CredentialLoginModal() {
  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      <form action={loginWithCredentials} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email address"
          required
          className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
        />
        <button className="bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950 hover:cursor-pointer">
          Log In
        </button>
      </form>
    </div>
  );
}
