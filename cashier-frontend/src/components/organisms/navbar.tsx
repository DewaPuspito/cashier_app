'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../atomics/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';
  const isCashier = user?.role === 'CASHIER';

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="w-full bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link href={isAdmin ? '/admin/dashboard' : '/cashier/dashboard'}>
          <span className="hover:underline cursor-pointer">Kasir App</span>
        </Link>
      </div>
      <div className="space-x-6 text-sm">
        {isAdmin && (
          <>
            <Link href="/admin/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/products" className="hover:underline">
              Products
            </Link>
            <Link href="/admin/cashiers" className="hover:underline">
              Cashiers
            </Link>
          </>
        )}
        {isCashier && (
          <>
            <Link href="/cashier/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/cashier/transactions" className="hover:underline">
              Transactions
            </Link>
          </>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};
