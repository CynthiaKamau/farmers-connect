import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/signin", "/signup", "/"];
const adminRoutes = ["/admin"];
const farmerRoutes = ["/farmers"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // No token - redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Decode token to get role
  let userRole: string | null = null;
  try {
    const decoded = jwtDecode<{ id: string; role: string }>(token);
    userRole = decoded.role;
  } catch (err) {
    // Invalid token - redirect to signin
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Admin trying to access farmer routes - redirect
  if (pathname.startsWith("/farmers") && userRole !== "farmer") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Farmer trying to access admin routes - redirect
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/farmers", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
