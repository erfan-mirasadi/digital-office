"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="absolute top-4 right-4 z-50 bg-red-600/80 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-xl backdrop-blur-md shadow-lg transition-all disabled:opacity-50 border border-red-500/50"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
