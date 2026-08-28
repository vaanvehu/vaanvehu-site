"use client";

import { waHref } from "@/lib/whatsapp";

export default function WhatsAppFab({ phone }: { phone: string }) {
  return (
    <a
      href={waHref(phone)}
      aria-label="WhatsApp"
      className="fixed z-90 flex items-center justify-center rounded-full text-white
        bottom-[18px] right-[16px] w-[52px] h-[52px] shadow-[var(--shadow-md)]
        vm:bottom-[28px] vm:left-[28px] vm:right-auto vm:w-[60px] vm:h-[60px] vm:shadow-[0_6px_18px_rgba(28,74,52,0.28)]"
      style={{ background: "var(--wa-green)" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" className="vm:w-[30px] vm:h-[30px]">
        <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.6-2.3-1.4-3-2.6-.1-.2-.1-.4.1-.5.2-.2.5-.5.6-.7.1-.2.1-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.3-.4-.5-.4h-.4c-.2 0-.5.1-.7.4-.2.3-.9 1-.9 2.3 0 1.4 1 2.7 1.1 2.9.1.2 1.9 3 4.6 4 2.2.9 2.7.7 3.2.6.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
      </svg>
    </a>
  );
}
