import { NextRequest, NextResponse } from "next/server";
import {
  getClientIp,
  isLoginRateLimited,
  recordLoginAttempt,
  verifyAdminPassword,
  isTotpEnabled,
  getOrCreateTotpSecretPendingEnrollment,
  createPendingLogin,
  logAdminAction,
} from "@/lib/admin-auth";
import { totpAuthUrl } from "@/lib/totp";

// Step 1 of login: password only. On success, hands back a short-lived
// pendingToken and tells the client whether it needs to go through first-time
// TOTP enrollment or just enter its existing 6-digit code — no session cookie
// is issued yet, that only happens after /api/admin/login/totp succeeds.
export async function POST(req: NextRequest) {
  const ip = await getClientIp();

  if (await isLoginRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "יותר מדי ניסיונות כניסה. נסה שוב בעוד כמה דקות." },
      { status: 429 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  const ok = typeof password === "string" && verifyAdminPassword(password);
  await recordLoginAttempt(ip, ok);
  await logAdminAction(ok ? "login_password_ok" : "login_password_fail", undefined, ip);

  if (!ok) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const enabled = await isTotpEnabled();
  if (!enabled) {
    const secret = await getOrCreateTotpSecretPendingEnrollment();
    const pendingToken = await createPendingLogin(true);
    return NextResponse.json({
      step: "setup_totp",
      pendingToken,
      secret,
      otpauthUrl: totpAuthUrl(secret, "מנהל", "וְאַנְוֵהוּ"),
    });
  }

  const pendingToken = await createPendingLogin(false);
  return NextResponse.json({ step: "verify_totp", pendingToken });
}
