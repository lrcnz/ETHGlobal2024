"use client";

import { TardisLogo } from "@/svgs/tardis-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(target: string, pathname: string) {
  if (target === '/dashboard') {
    return target === pathname;
  }

  if (target === '/profile') {
    return pathname.startsWith('/profile');
  }

  return false;
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative p-5 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.12)] bg-black ">
      <div className="w-full h-full flex items-center justify-between">
        <TardisLogo />
      </div>
      <div className="absolute top-0 h-full left-[50%] -translate-x-[50%] flex items-center justify-center gap-10">
        <Link
          href="/dashboard"
          className={isActive('/', pathname) ? "text-sm font-bold text-base-200" : "text-sm text-base-200"}
        >
          Find Box
        </Link>
        <Link href="/profile"
          className={isActive('/profile', pathname) ? "text-sm font-bold text-base-200" : "text-sm text-base-200"}>
          My Box
        </Link>
      </div>
    </header>
  );
}
