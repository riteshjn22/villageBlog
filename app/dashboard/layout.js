"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LeftSideBar from "@/components/dashboard/leftSideBar";

export default function DashboardLayout({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Auto check session expiry every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/auth/session");
      const currentSession = await res.json();
      if (!currentSession || !currentSession.user) {
        await signOut({ redirect: false });
        router.push("/login");
      }
    }, 60 * 1000); // check every 60 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="flex w-full md:max-w-275 mx-auto p-4 flex-wrap gap-4 md:flex-nowrap">
      <LeftSideBar />
      {children}
    </main>
  );
}
