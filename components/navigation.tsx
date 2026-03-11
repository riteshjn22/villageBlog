"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();
  return (
    <div className="flex">
      <ul className="flex gap-4">
        <li>
          <Link href="/" className={pathname === "/" ? "font-bold" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className={pathname.startsWith("/blog") ? "font-bold" : ""}
          >
            Blog
          </Link>
        </li>
      </ul>
    </div>
  );
}
export default Navigation;
