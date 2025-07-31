'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function EmployeeNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Employee Portal</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            href="/employee" 
            className={`block p-2 rounded ${pathname === '/employee' ? 'bg-green-600' : 'hover:bg-gray-700'}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            href="/employee/tasks" 
            className={`block p-2 rounded ${pathname.startsWith('/employee/tasks') ? 'bg-green-600' : 'hover:bg-gray-700'}`}
          >
            My Tasks
          </Link>
        </li>
        <li>
          <Link 
            href="/employee/profile" 
            className={`block p-2 rounded ${pathname.startsWith('/employee/profile') ? 'bg-green-600' : 'hover:bg-gray-700'}`}
          >
            Profile
          </Link>
        </li>
        <li className="mt-8">
          <button
            onClick={logout}
            className="w-full text-left p-2 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}