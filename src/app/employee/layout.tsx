import { ReactNode } from 'react';
import EmployeeNav from '@/components/EmployeeNav';

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <EmployeeNav />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}