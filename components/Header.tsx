"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navigation from "./navigation";

function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <header className="sticky top-0 z-50 bg-sky-950 p-4 text-white shadow-md shadow-indigo-200">
      <div className="m-auto flex w-full flex-wrap items-center justify-between md:max-w-275">
        <Link href="/">
          <h1 className="text-2xl font-bold">Village Trends</h1>
        </Link>
        {!isDashboard && <Navigation />}

        {isDashboard && session && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
