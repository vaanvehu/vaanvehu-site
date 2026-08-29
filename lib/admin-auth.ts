import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "va_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h
const PENDING_TTL_MS = 1000 * 60 * 5; // 5 min to complete the TOTP step
const LOGIN_SCOPE = "admin_login";
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 1000 * 60 * 15; // 15 min lockout window

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

// SHA-256 both sides first so timingSafeEqual always compares equal-length
// buffers, then compare those digests in constant time — avoids both a
// length-based short-circuit and a raw string ===, either of which leaks
// timing information about how many leading characters matched.
export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "vaanvehu";
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isLoginRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const failures = await prisma.rateLimitEvent.count({
    where: { scope: LOGIN_SCOPE, key: ip, success: false, createdAt: { gt: since } },
  });
  return failures >= LOGIN_MAX_ATTEMPTS;
}

export async function recordLoginAttempt(ip: string, success: boolean): Promise<void> {
  await prisma.rateLimitEvent.create({ data: { scope: LOGIN_SCOPE, key: ip, success } });
}

export async function isOrderRateLimited(ip: string, max = 12, windowMs = 1000 * 60 * 60): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  const count = await prisma.rateLimitEvent.count({
    where: { scope: "order_create", key: ip, createdAt: { gt: since } },
  });
  return count >= max;
}

export async function recordOrderCreated(ip: string): Promise<void> {
  await prisma.rateLimitEvent.create({ data: { scope: "order_create", key: ip, success: true } });
}

export async function createPendingLogin(setup: boolean): Promise<string> {
  const token = randomBytes24Hex();
  await prisma.pendingAdminLogin.create({
    data: { token, setup, expiresAt: new Date(Date.now() + PENDING_TTL_MS) },
  });
  return token;
}

export async function consumePendingLogin(token: string): Promise<{ setup: boolean } | null> {
  const pending = await prisma.pendingAdminLogin.findUnique({ where: { token } });
  if (!pending) return null;
  await prisma.pendingAdminLogin.delete({ where: { token } }).catch(() => {});
  if (pending.expiresAt < new Date()) return null;
  return { setup: pending.setup };
}

export async function getOrCreateTotpSecretPendingEnrollment(): Promise<string> {
  const existing = await prisma.adminAuth.findUnique({ where: { id: 1 } });
  if (existing?.totpSecret) return existing.totpSecret;
  const { generateTotpSecret } = await import("@/lib/totp");
  const secret = generateTotpSecret();
  await prisma.adminAuth.upsert({
    where: { id: 1 },
    update: { totpSecret: secret, totpEnabled: false },
    create: { id: 1, totpSecret: secret, totpEnabled: false },
  });
  return secret;
}

export async function isTotpEnabled(): Promise<boolean> {
  const auth = await prisma.adminAuth.findUnique({ where: { id: 1 } });
  return !!auth?.totpEnabled;
}

export async function getTotpSecret(): Promise<string | null> {
  const auth = await prisma.adminAuth.findUnique({ where: { id: 1 } });
  return auth?.totpSecret ?? null;
}

export async function enableTotp(): Promise<void> {
  await prisma.adminAuth.update({ where: { id: 1 }, data: { totpEnabled: true } });
}

export async function createAdminSession(ip: string): Promise<string> {
  const token = randomBytes24Hex();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.adminSession.create({ data: { token, ip, expiresAt } });
  await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return token;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
    return false;
  }
  return true;
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await prisma.adminSession.delete({ where: { token } }).catch(() => {});
  store.delete(COOKIE_NAME);
}

export async function logAdminAction(action: string, detail?: string, ip?: string): Promise<void> {
  await prisma.adminActionLog.create({ data: { action, detail, ip } }).catch(() => {});
}

function randomBytes24Hex(): string {
  return randomBytes(24).toString("hex");
}

export { COOKIE_NAME };
