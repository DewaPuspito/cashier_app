'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cashier } from '@/types/user';
import { Button } from '../atomics/Button';
import { SearchBar } from '../molecules/SearchBar';
import { CashierTable } from '../molecules/CashierTable';
import { PaginationControls } from '../molecules/PaginationControls';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

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
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Cashier data will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/cashier/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await refresh();
        
        Swal.fire(
          'Deleted!',
          'Cashier data has been deleted.',
          'success'
        );
      } catch (err) {
        console.error('Failed to delete cashier:', err);
        Swal.fire(
          'Error!',
          'Failed to delete cashier. Please try again later.',
          'error'
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Cashiers</h2>

        <div className="space-y-4">
          <SearchBar onSearch={(query: string) => setSearchTerm(query)}>
            <Button 
                variant="primary" 
                onClick={() => router.push('/admin/cashier/create-cashier')} 
                className="px-3 py-1 text-sm border text-green-600 hover:bg-green-700 rounded-lg"
              >
                + Add Cashier
              </Button>
          </SearchBar>

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
