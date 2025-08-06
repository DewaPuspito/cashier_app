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

  const redirectPath = admin ? '/admin/reports' : '/cashier/shift';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-teal-500 text-white px-6 py-4 shadow-md flex justify-between items-center">
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

      <div className="space-x-10 text-sm flex items-center">
        {admin && (
          <>
          <Link href="/admin/products" className="hover:underline flex items-center gap-2">
            <Image src="/file.svg" alt="Products Icon" width={20} height={20} />
            Products
          </Link>
          <Link href="/admin/cashier" className="hover:underline flex items-center gap-2">
            <Image src="/window.svg" alt="Cashiers Icon" width={20} height={20} />
            Cashiers
          </Link>
        </>
      )}
        {cashier && (
          <Link href="/cashier/transaction" className="hover:underline">
            Transactions
          </Link>
        )}
       <Button variant="danger" onClick={handleLogout} className="flex items-center gap-2">
          <Image src="/globe.svg" alt="Logout Icon" width={20} height={20} />
          Logout
        </Button>
      </div>
    </nav>
  );
};
