import type { Lang } from "@/lib/i18n";

export default function FlagIcon({ lang, size = 30, bordered = false }: { lang: Lang; size?: number; bordered?: boolean }) {
  const h = Math.round((size * 22) / 33);
  const style = bordered ? { border: "1px solid var(--color-divider)", display: "block" } : { display: "block" };
  if (lang === "he") {
    return (
      <svg width={size} height={h} viewBox="0 0 33 22" style={style}>
        <rect width="33" height="22" fill="#fff" />
        <rect y="2" width="33" height="3.4" fill="#0038b8" />
        <rect y="16.6" width="33" height="3.4" fill="#0038b8" />
        <path d="M16.5 7l3.6 6.2h-7.2L16.5 7z" fill="none" stroke="#0038b8" strokeWidth="1.1" />
        <path d="M16.5 15.4l-3.6-6.2h7.2l-3.6 6.2z" fill="none" stroke="#0038b8" strokeWidth="1.1" />
      </svg>
    );
  }
  if (lang === "en") {
    return (
      <svg width={size} height={h} viewBox="0 0 33 22" style={style}>
        <rect width="33" height="22" fill="#fff" />
        <g fill="#b22234">
          <rect width="33" height="1.7" />
          <rect y="3.4" width="33" height="1.7" />
          <rect y="6.8" width="33" height="1.7" />
          <rect y="10.2" width="33" height="1.7" />
          <rect y="13.6" width="33" height="1.7" />
          <rect y="17" width="33" height="1.7" />
          <rect y="20.3" width="33" height="1.7" />
        </g>
        <rect width="14" height="11.9" fill="#3c3b6e" />
      </svg>
    );
  }
  return (
    <svg width={size} height={h} viewBox="0 0 33 22" style={style}>
      <rect width="11" height="22" fill="#0055a4" />
      <rect x="11" width="11" height="22" fill="#fff" />
      <rect x="22" width="11" height="22" fill="#ef4135" />
    </svg>
  );
}
