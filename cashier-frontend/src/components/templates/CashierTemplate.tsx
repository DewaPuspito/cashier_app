'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cashier } from '@/types/user';
import { CashierFilterBar } from '../molecules/CashierFilterBar';
import { CashierTable } from '../molecules/CashierTable';
import { PaginationControls } from '../molecules/PaginationControls';
import axios from '@/lib/axios';

export const AdminCashierTemplate = () => {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

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
              search: searchTerm.toLowerCase(),
              page: currentPage,
              limit: 10
            },
          });
          if (res.data) {
            const { data, totalPages: total } = res.data;
            if (Array.isArray(data) && data.length > 0) {
              setCashiers(data);
              setTotalPages(total);
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
    }, [token, searchTerm, currentPage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Cashiers</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
          <CashierFilterBar
            onSearch={(query: string) => setSearchTerm(query)}
            onAdd={() => {
                router.push('/admin/cashier/create-cashier');
            }}
            />
          </div>

          <CashierTable
            data={cashiers}
            onEdit={(cashier) => router.push(`/admin/cashier/${cashier.id}/edit-cashier`)}
            onDelete={handleDelete}
          />

          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>
    </div>
  );
};
