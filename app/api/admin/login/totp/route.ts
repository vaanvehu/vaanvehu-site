import { NextRequest, NextResponse } from "next/server";
import {
  getClientIp,
  isLoginRateLimited,
  recordLoginAttempt,
  consumePendingLogin,
  getTotpSecret,
  enableTotp,
  createAdminSession,
  setAdminCookie,
  logAdminAction,
} from "@/lib/admin-auth";
import { verifyTotp } from "@/lib/totp";

// Step 2 of login: the 6-digit authenticator code. Completes TOTP enrollment
// on first use, or just verifies the code on every login after that — either
// way, this is the only place a session cookie gets issued.
export async function POST(req: NextRequest) {
  const ip = await getClientIp();

  if (await isLoginRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "יותר מדי ניסיונות כניסה. נסה שוב בעוד כמה דקות." },
      { status: 429 }
    );
  }

  const { pendingToken, code } = await req.json().catch(() => ({}));
  if (typeof pendingToken !== "string" || typeof code !== "string") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const pending = await consumePendingLogin(pendingToken);
  if (!pending) {
    return NextResponse.json({ error: "expired" }, { status: 401 });
  }

  const secret = await getTotpSecret();
  const ok = !!secret && verifyTotp(secret, code);
  await recordLoginAttempt(ip, ok);
  await logAdminAction(ok ? "login_totp_ok" : "login_totp_fail", pending.setup ? "setup" : undefined, ip);

  if (!ok) {
    return NextResponse.json({ error: "invalid_code" }, { status: 401 });
  }

  if (pending.setup) await enableTotp();

  const token = await createAdminSession(ip);
  await setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
