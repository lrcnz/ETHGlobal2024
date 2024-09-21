"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function Header() {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    router.push("/profile");
  }, [router]);
  return (
    <div className="mb-3">
      <h2 className="text-[40px] leading-10 font-bold mb-7">Action Box</h2>
      <div className="flex items-center gap-2" onClick={handleGoBack}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <p className="text-xs leading-3 font-light cursor-pointer">back to My Box</p>
      </div>
    </div>
  );
}

Header.displayName = "Header";