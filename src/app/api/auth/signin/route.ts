import { NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';
// import { setTokenCookie } from '@/lib/server/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  let { email, password } = await request.json();
  email = email.toLowerCase();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createToken(user.id, user.role);
    // console.log("35 token:", token);
    // setTokenCookie(token);
    const cookieStore = await cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, role: user.role } },
      {
        headers: {
          // Debug headers to verify cookie was processed
          'X-Cookie-Set': 'true',
          'Set-Cookie': cookieStore.toString()
        }
      }
    );
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}