import { NextResponse } from 'next/server';
import { getUserFromTokenWithoutGivenToken } from '@/lib/server/auth';

export async function GET() {
  try {
    const user = await getUserFromTokenWithoutGivenToken();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(null);
  }
}