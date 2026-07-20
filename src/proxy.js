import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("\n================ PROXY =================");
  console.log("Path:", pathname);
  console.log("Access Token Exists:", !!accessToken);
  console.log("Access Token:", accessToken);

  console.log(
    "All Cookies:",
    request.cookies.getAll().map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
    }))
  );

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

  console.log("Is Protected Route:", isProtected);

  if (!accessToken) {
    console.log("❌ No access token found.");

    if (isProtected || pathname !== "/admin/auth") {
      console.log("➡️ Redirecting to /admin/auth");
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }

    console.log("✅ Staying on auth page");
    return NextResponse.next();
  }

  console.log("✅ Access token found");

  if (pathname === "/admin/auth") {
    console.log("➡️ Already logged in, redirecting to dashboard");
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (!pathname.startsWith("/admin")) {
    console.log("➡️ Non-admin route, redirecting to dashboard");
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  console.log("✅ Allowing request to continue");
  console.log("========================================\n");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};