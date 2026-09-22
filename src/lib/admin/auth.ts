/**
 * ─────────────────────────────────────────────────────────────
 *  ADMIN AUTHENTICATION
 *
 *  One password per site, set in the ADMIN_PASSWORD environment
 *  variable. A successful login sets an http-only, signed cookie
 *  valid for 7 days. Every admin page and every admin action
 *  re-verifies it on the server — nothing is trusted from the
 *  browser.
 * ─────────────────────────────────────────────────────────────
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "np_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AdminConfigProblem = "missing-password" | "missing-secret" | "weak-secret" | null;

/** Why the admin cannot be used on this deployment, if it can't. */
export function adminConfigProblem(): AdminConfigProblem {
  if (!process.env.ADMIN_PASSWORD) return "missing-password";
  if (!process.env.ADMIN_SESSION_SECRET) return "missing-secret";
  if (process.env.ADMIN_SESSION_SECRET.length < 32) return "weak-secret";
  return null;
}

const sign = (payload: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");

/** Compare two strings in constant time, whatever their lengths. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(candidate, expected!);
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp: expires })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (adminConfigProblem()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Use at the top of every admin page and action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
