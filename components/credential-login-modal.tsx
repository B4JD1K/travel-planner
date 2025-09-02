"use client"

import {useState, FormEvent} from "react";

export default function CredentialLoginModal() {
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        // body: JSON.stringify({email, password}),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to register");
        return;
      }

      alert("Rejestracja przebiegła pomyślnie! Możesz się zalogować.");
    } catch (err) {
      setError("Coś poszło nie tak, spróbuj ponownie." + err);
    }
  }

  return (
    <div className="bg-whitemax-w-md w-full pt-4">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email address"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          className="border p-2 rounded"
        />
        <button className="bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950">
          Log In
        </button>
      </form>
    </div>
  );
}
