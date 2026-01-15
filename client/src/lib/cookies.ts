/**
 * Cookie management utilities
 */

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void {
  if (typeof document === "undefined") return;

  const {
    maxAge = 604800, // 7 days
    path = "/",
    domain,
    secure = false,
    sameSite = "Lax",
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=${path}; SameSite=${sameSite}`;

  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += "; Secure";

  document.cookie = cookieString;
}

export function deleteCookie(name: string, path: string = "/"): void {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; max-age=0; path=${path}`;
}

export function getAuthToken(): string | null {
  return getCookie("token");
}

export function setAuthToken(token: string): void {
  setCookie("token", token, {
    maxAge: 604800, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
}

export function deleteAuthToken(): void {
  deleteCookie("token", "/");
}
