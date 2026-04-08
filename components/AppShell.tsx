"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { applyTheme, getStoredTheme } from "@/lib/themes";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Header from "./Header";

const PUBLIC_PATHS = ["/login", "/signup", "/pricing", "/privacy", "/terms", "/forgot-password", "/reset-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!isPublic && !isLoggedIn()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [pathname, isPublic, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
