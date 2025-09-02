"use client"

import {useState, FormEvent} from "react";

export default function RegisterModal() {
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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
        <div className="flex gap-4 w-full">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            name="surname"
            placeholder="Surame"
            required
            className="border p-2 rounded w-1/2"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border p-2 rounded"
        />
        <button className="bg-gray-900 px-4 py-2 rounded text-white font-medium text-sm hover:bg-gray-950">
          Register
        </button>
      </form>
    </div>
  );
}
