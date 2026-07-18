import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    if (pathname !== "/admin/auth") {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
    return NextResponse.next();
  }
  
  if (pathname === "/admin/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};