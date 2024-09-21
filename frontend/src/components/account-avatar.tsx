"use client";

import { useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";
import { twMerge } from "tailwind-merge";

interface AddressProps {
  address?: string;
  className?: string;
  size?: number;
}

export default function AccountAvatar({
  address,
  className,
  size = 16,
}: AddressProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!containerRef.current || !address) return;

    // Note: jazzicon use import will cause error in next.js, so use require instead
    // eslint-disable-next-line no-undef
    const icon = jazzicon(size, parseInt(address.slice(2, 10)));
    // clear the container
    containerRef.current.innerHTML = "";
    // set icon size to `width`px, and display to block
    icon.style.width = `${size - 2}px`;
    icon.style.height = `${size - 2}px`;
    icon.style.display = "block";

    containerRef.current.appendChild(icon);
  }, [address, size]);

  return (
    <div
      className={twMerge( "rounded-full border border-border-address", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
      ref={containerRef}
    />
  );
}

AccountAvatar.displayName = "AccountAvatar";