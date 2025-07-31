import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

import { jwtVerify } from "jose";
export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log("Current pathname middleware:", pathname);

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isEmployeeRoute = request.nextUrl.pathname.startsWith("/employee");

  if (!isAdminRoute && !isEmployeeRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const role = payload.role as string;

    if (role === 'ADMIN' && !isAdminRoute) {
      return NextResponse.redirect(new URL('/unauthorised', request.url))
    }

    if (role === 'EMPLOYEE' && !isEmployeeRoute) {
      return NextResponse.redirect(new URL('/unauthorised', request.url))
    }

     return NextResponse.next()


  } catch (error) {
    console.error('JWT decoding error:', error)
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}
export const config = {
    // matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
//   matcher: ["/admin/:path*", "/employee/:path*","/api/:path*"], 
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],

};
