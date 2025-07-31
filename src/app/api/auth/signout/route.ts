import { NextResponse } from "next/server";
// import { clearTokenCookie } from '@/lib/server/auth';
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  // clearTokenCookie();
  return NextResponse.json({ message: "Signed out successfully" });
}
