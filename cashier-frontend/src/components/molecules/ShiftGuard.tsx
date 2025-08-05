import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export const ShiftGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/shift/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data?.data) {
          toast.error('Please start your shift first');
          router.push('/cashier/shift');
          return;
        }

        setLoading(false);
      } catch (error) {
        toast.error('Please start your shift first');
        router.push('/cashier/shift');
      }
    };

    checkActiveShift();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};