'use client';

import { useRouter } from 'next/navigation';
import { Heading } from '../atomics/Heading';
import { Button } from '../atomics/Button';

export const LandingTemplate = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <img src="/SigmaMart.png" alt="Company Logo" className="w-100 h-40 mb-4" />

      <Heading level={1} className="text-2xl text-cyan-600 mb-4">Welcome to SigmaMart Web Cashier</Heading>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={() => router.push('/admin/login')}>
          Login as Admin
        </Button>
        <Button onClick={() => router.push('/cashier/login')}>
          Login as Cashier
        </Button>
      </div>
    </div>
  );
};
