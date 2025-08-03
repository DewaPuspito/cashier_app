'use client';

import { useEffect, useState } from 'react';
import { Cashier } from '@/types/user';
import { CashierFilterBar } from '../molecules/CashierFilterBar';
import { CashierTable } from '../molecules/CashierTable';
import { CashierFormModal } from '../organisms/CashierFormModal';
import axios from '@/lib/axios';

export const AdminCashierTemplate = () => {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      console.warn('Token not found.');
      return;
    }
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchCashiers = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('/cashier', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              search: searchTerm,
            },
          });
          if (res.data && Array.isArray(res.data)) {
            const cashierArray = Object.values(res.data);
            if (cashierArray.length > 0) {
              setCashiers(cashierArray);
            } else {
              setCashiers([]);
            }
          } else {
            setCashiers([]);
            console.warn('Unexpected response format:', res.data);
          }
        } catch (err) {
          console.error('Failed to fetch cashiers:', err);
          setCashiers([]);
        }
      };
    

    fetchCashiers();
  }, [token, searchTerm]);

  const refresh = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/cashier', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
        },
      });

      if (res.data && Array.isArray(res.data)) {
        const cashierArray = Object.values(res.data);
        if (cashierArray.length > 0) {
          setCashiers(cashierArray);
        } else {
          setCashiers([]);
        }
      } else {
        setCashiers([]);
        console.warn('Unexpected response format:', res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cashiers:', err);
      setCashiers([]);
    }
  };

  const handleEdit = (cashier: Cashier) => {
    setSelectedCashier(cashier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return console.warn('No token found for delete.');
    try {
      await axios.delete(`/cashier/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await refresh();
    } catch (err) {
      console.error('Failed to delete cashier:', err);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
  }) => {
    if (!token) return console.warn('No token found for submit.');
    try {
      if (selectedCashier) {
        await axios.put(
          `/cashier/${selectedCashier.id}`,
          { name: data.name, email: data.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          '/cashier',
          { ...data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsModalOpen(false);
      setSelectedCashier(null);
      await refresh();
    } catch (err) {
      console.error('Failed to submit cashier:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Cashiers</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <CashierFilterBar
              onSearch={(query: string) => setSearchTerm(query)}
              onAdd={() => {
                setSelectedCashier(null);
                setIsModalOpen(true);
              }}
            />
          </div>

          <CashierTable
            data={cashiers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <CashierFormModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCashier(null);
            }}
            initialData={selectedCashier || undefined}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
