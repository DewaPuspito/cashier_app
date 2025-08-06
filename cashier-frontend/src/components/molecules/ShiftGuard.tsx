'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const ShiftGuard = ({ children }: { children: React.ReactNode }) => {
  const [hasShift, setHasShift] = useState<boolean | null>(null);

  useEffect(() => {
    const shiftId = localStorage.getItem('shiftId');
    if (!shiftId) {
      toast.error('Missing shift ID. Please start your shift first.');
      setHasShift(false);
      return;
    }

    setHasShift(true);
  }, []);

  if (hasShift === null) {
    return <div>Loading...</div>;
  }

  if (!hasShift) {
    return <p className="text-center text-red-500">Missing shift ID.</p>;
  }

  return <>{children}</>;
};
