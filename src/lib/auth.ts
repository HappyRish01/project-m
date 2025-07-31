import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function getUserFromToken(token: string): { userId: number; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
  } catch {
    return null;
  }
}
export function verifyJWT(token: string): { userId: string; role: 'ADMIN' | 'EMPLOYEE' } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: 'ADMIN' | 'EMPLOYEE' };
  } catch (error) {
    throw new Error('Invalid token');
  }
}