import {registerUser} from "@/lib/auth-actions";

export default function RegisterModal() {
  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      <form action={registerUser} className="flex flex-col gap-4">
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
        <button className="bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950 hover:cursor-pointer">
          Register
        </button>
      </form>
    </div>
  );
}
