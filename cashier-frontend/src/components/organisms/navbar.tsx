'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../atomics/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import Image from 'next/image';

export const Navbar = () => {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { logout } = useAuthStore();


  const admin = useAuthStore((state) => state.admin);
  const cashier = useAuthStore((state) => state.cashier);

  useEffect(() => {
    if (!hasHydrated) return;
  
    if (!admin && !cashier) {
      router.push('/login');
    }
  }, [hasHydrated, admin, cashier]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const redirectPath = admin ? '/admin/report' : '/cashier/shift';

  return (
    <nav className="w-full bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo (paling kiri) */}
      <div>
        <Link href={redirectPath}>
          <Image
            src="/SigmaMart.png" 
            alt="Kasir App Logo"
            width={120}
            height={30}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Navigasi */}
      <div className="space-x-6 text-sm flex items-center">
        {admin && (
          <>
            <Link href="/admin/products" className="hover:underline">
              Products
            </Link>
            <Link href="/admin/cashiers" className="hover:underline">
              Cashiers
            </Link>
          </>
        )}
        {cashier && (
          <Link href="/cashier/transactions" className="hover:underline">
            Transactions
          </Link>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};
