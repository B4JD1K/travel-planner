import {registerUser} from "@/lib/auth-actions";
import {LoaderPinwheel} from "lucide-react";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function RegisterModal() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (info) toast.success(info);
    if (error) toast.error(error);
  }, [info, error]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setInfo(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", password);

      const {success, message} = await registerUser(formData);

      if (success) {
        setInfo(message);
        router.push("/trips");
      } else {
        setError(message);
      }
    } catch (e) {
      console.log("Error in handleRegister():", e);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      <fieldset disabled={saving} className="group">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 w-full group-disabled:opacity-50">
            <div className="flex gap-4 w-full">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded w-1/2 focus:ring-2 focus:outline-none focus:ring-blue-500"
              />
              <input
                type="text"
                name="surname"
                id="surname"
                placeholder="Surame"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="border p-2 rounded w-1/2 focus:ring-2 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
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
