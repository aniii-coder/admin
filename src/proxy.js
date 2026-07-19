import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const protectedRoutes = [
    "/admin/dashboard*",
    "/admin/blogs*",
  ];

  const isProtected = protectedRoutes.some((route) => {
    if (route.endsWith("*")) {
      const baseRoute = route.slice(0, -1);
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  if (!accessToken) {
    if (isProtected || pathname !== "/admin/auth") {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/auth") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};