import {registerUser} from "@/lib/auth-actions";
import {LoaderPinwheel} from "lucide-react";
import {useState} from "react";

export default function RegisterModal() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      <fieldset disabled={saving} className="group">
        <form action={registerUser}
              onSubmit={() => setSaving(true)}
              className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4 w-full group-disabled:opacity-50">
            <div className="flex gap-4 w-full">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="border p-2 rounded w-1/2 focus:ring-2 focus:outline-none focus:ring-blue-500"
              />
              <input
                type="text"
                name="surname"
                placeholder="Surame"
                required
                className="border p-2 rounded w-1/2 focus:ring-2 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            className="inline-flex items-center justify-center bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950 hover:cursor-pointer group-disabled:pointer-events-none">
            <LoaderPinwheel className="animate-spin absolute h-4 group-enabled:opacity-0"/>
            <span className="group-disabled:opacity-0">Register</span>
          </button>
        </form>
      </fieldset>
    </div>
  );
}
