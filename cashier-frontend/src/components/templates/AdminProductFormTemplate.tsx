'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { ProductForm } from '../organisms/ProductForm';
import { Category, Product } from '@/types/product';
import toast from 'react-hot-toast';

type Props = {
  mode: 'create' | 'edit';
  id?: string;
};

export const ProductFormTemplate = ({ mode, id }: Props) => {
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);

    if (mode === 'edit' && id && savedToken) {
      axios.get(`/products/${id}`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        const productData = res.data.data;
        setInitialData({
          ...productData,
          price: Number(productData.price)
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load products');
      });
    }
  }, [id, mode]);

  const handleSubmit = async (data: FormData) => {
    if (!token) return;

    const loadingToast = toast.loading(mode === 'create' ? 'Adding Product...' : 'Updating Product...');

    try {
      if (mode === 'create') {
        await axios.post('/products', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Product successfully added');
      } else if (id) {
        await axios.put(`/products/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Product successfully updated');
      }

      router.push('/admin/products');
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error(mode === 'create' ? 'Failed to add products' : 'Failed to update products');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-24 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h2>
        <ProductForm
          initialData={initialData ? {
            name: initialData.name,
            price: initialData.price,
            stock: initialData.stock,
            category: initialData.category as Category,
            imageUrl: initialData.imageUrl
          } : undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
