"use client";

import { usePathname } from "next/navigation";

export default function MobileWatermark() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div
      aria-hidden
      className="hidden max-vm:block fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundImage: "url('/assets/bg-live.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.055,
      }}
    />
  );
}
