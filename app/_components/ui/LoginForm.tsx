"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@diszcovery.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/workspace");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          DISZCOVERY
        </h1>
        <p className="text-slate-400 text-sm">Virtual Office Portal</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm font-medium bg-red-950/30 p-3 rounded-lg border border-red-900/50 text-center animate-pulse">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden bg-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all hover:bg-cyan-500 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Enter Workspace"
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
