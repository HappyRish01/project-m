// import prisma from './prisma';
"use server";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    // secure: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:  60 * 60 * 24 * 7,
    path: '/',
  });
  console.log("Token set in cookie:", token);
}

export async function getUserFromTokenWithoutGivenToken(): Promise<any> {
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    // const user = await prisma.user.findUnique({
    //   where: { id: decoded.userId },
    //   select: { id: true, email: true, name: true, role: true }
    // });
    
    return decoded;
  } catch (error) {
    return null;
  }
}


export async function clearTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('authToken');
}