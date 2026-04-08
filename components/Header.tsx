"use client";

import ThemeToggle from "./ThemeToggle";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Header() {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setInitials(
        user.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      );
    }
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 md:px-6">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white md:hidden">
        Task Manager
      </h1>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {initials && (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}
