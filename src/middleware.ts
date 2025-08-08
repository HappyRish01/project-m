import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicPaths = ["/api/auth/signin", "/api/auth/signup", "/api/auth/me", "/login"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin");
  const isEmployeeRoute = pathname.startsWith("/employee");

  

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const role = payload.role as string;

    if (role === "ADMIN" && isEmployeeRoute) {
      return isApiRoute
        ? new NextResponse(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
        : NextResponse.redirect(new URL("/unauthorised", request.url));
    }

    if (role === "EMPLOYEE" && isAdminRoute) {
      return isApiRoute
        ? new NextResponse(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
        : NextResponse.redirect(new URL("/unauthorised", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT decoding error:", error);

    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/api/:path*"],
}
