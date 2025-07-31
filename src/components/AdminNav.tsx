'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            href="/admin" 
            className={`block p-2 rounded ${pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/bill" 
            className={`block p-2 rounded ${pathname.startsWith('/admin/bill') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Billing
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/add" 
            className={`block p-2 rounded ${pathname.startsWith('/admin/add') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Add Records
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