import Link from "next/link";

export default function Footer() {
  // Legal footer links are shown in Hebrew regardless of the active language —
  // matches the source design (the mobile drawer menu translates them; this bottom
  // footer does not, in every language variant of the prototype).
  return (
    <footer className="border-t" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
      <div className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-5 vm:pt-[30px] pb-9 flex flex-col vm:flex-row gap-2.5 vm:gap-7 items-center justify-center text-center text-[15px] vm:text-[16px]">
        <Link href="/accessibility" style={{ color: "var(--color-text)", opacity: 0.7 }}>הצהרת נגישות</Link>
        <Link href="/terms" style={{ color: "var(--color-text)", opacity: 0.7 }}>תקנון האתר</Link>
        <Link href="/privacy" style={{ color: "var(--color-text)", opacity: 0.7 }}>מדיניות פרטיות</Link>
        <Link href="/cancellations" style={{ color: "var(--color-text)", opacity: 0.7 }}>מדיניות ביטולים</Link>
      </div>
    </footer>
  );
}
