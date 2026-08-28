"use client";

export default function MessageActionLink({
  orderId, href, channel, templateId, className, children, style,
}: {
  orderId: string;
  href: string;
  channel: "whatsapp" | "email";
  templateId?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => {
        fetch(`/api/admin/orders/${orderId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, templateId }),
          keepalive: true,
        }).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
