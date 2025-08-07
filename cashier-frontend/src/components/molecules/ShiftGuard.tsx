'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const ShiftGuard = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedShiftId = localStorage.getItem('shiftId');
    const shiftId = params?.id;

    if (!savedShiftId || savedShiftId !== shiftId) {
      toast.error('Please start your shift first.');
      router.push('/cashier/shift');
      return;
    }

    setIsValid(true);
    setChecked(true);
  }, [params, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isValid ? <>{children}</> : null;
};