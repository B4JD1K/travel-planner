import {loginWithCredentials} from "@/lib/auth-actions";
import {LoaderPinwheel} from "lucide-react";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function CredentialLoginModal() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (info) toast.success(info);
    if (error) toast.error(error);
  }, [info, error]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setInfo(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const {success, message} = await loginWithCredentials(formData);

      if (success) {
        setInfo(message);
        router.push("/trips");
      } else {
        setError(message);
      }
    } catch (e) {
      console.log("Error in handleLogin():", e);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      <fieldset disabled={saving} className="group">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 w-full group-disabled:opacity-50">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            className="inline-flex items-center justify-center bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950 hover:cursor-pointer group-disabled:pointer-events-none">
            <LoaderPinwheel className="animate-spin absolute h-4 group-enabled:opacity-0"/>
            <span className="group-disabled:opacity-0">Login</span>
          </button>
        </form>
      </fieldset>
    </div>
  );
}
