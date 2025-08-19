import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
// import { setTokenCookie } from '@/lib/server/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'EMPLOYEE', // Default role, can be changed
      },
    });

    // const token = createToken(user.id, user.role);
    // setTokenCookie(token);

    return NextResponse.json({
      success: "User created succesfully"
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}