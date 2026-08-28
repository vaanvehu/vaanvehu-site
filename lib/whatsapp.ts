// Builds a `whatsapp://send` deep link that opens the WhatsApp app already
// installed on the device — no Business API involved (see README "Messaging model").
export function waHref(rawPhone: string, text?: string): string {
  const digits = String(rawPhone).replace(/[^0-9]/g, "").replace(/^0/, "");
  const base = `whatsapp://send?phone=972${digits}`;
  return text ? `${base}&text=${encodeURIComponent(text)}` : base;
}

export function telHref(rawPhone: string): string {
  return `tel:${rawPhone}`;
}

export function mailtoHref(to: string, opts: { bcc?: string; subject?: string; body?: string }): string {
  const params = new URLSearchParams();
  if (opts.bcc) params.set("bcc", opts.bcc);
  if (opts.subject) params.set("subject", opts.subject);
  if (opts.body) params.set("body", opts.body);
  const qs = params.toString();
  return `mailto:${to}${qs ? `?${qs}` : ""}`;
}
