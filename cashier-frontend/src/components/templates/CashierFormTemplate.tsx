// components/templates/CashierFormTemplate.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { CashierForm } from '../organisms/CashierForm'
import { Cashier } from '@/types/user';

type Props = {
  mode: 'create' | 'edit';
  id?: string;
};

export const CashierFormTemplate = ({ mode, id }: Props) => {
  const [initialData, setInitialData] = useState<Cashier | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);

    if (mode === 'edit' && id && savedToken) {
      axios.get(`/cashier/${id}`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => setInitialData(res.data))
      .catch((err) => console.error(err));
    }
  }, [id, mode]);

  const handleSubmit = async (data: { name: string; email: string; password?: string }) => {
    if (!token) return;

    try {
      if (mode === 'create') {
        await axios.post('/cashier', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (id) {
        await axios.put(`/cashier/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      router.push('/admin/cashier');
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
          {mode === 'create' ? 'Add New Cashier' : 'Edit Cashier'}
        </h2>
        <CashierForm
            initialData={initialData || undefined}
            onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
