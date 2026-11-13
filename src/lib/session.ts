import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "acme_session";

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars)");
  return secret;
}

export type PortalSession = {
  customerId: string;
  email: string;
  role: "customer" | "staff";
};

export function signSession(session: PortalSession) {
  return jwt.sign(session, sessionSecret(), { algorithm: "HS256", expiresIn: "7d" });
}

export async function readSession(): Promise<PortalSession | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, sessionSecret(), { algorithms: ["HS256"] }) as PortalSession;
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: PortalSession) {
  (await cookies()).set(COOKIE_NAME, signSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
