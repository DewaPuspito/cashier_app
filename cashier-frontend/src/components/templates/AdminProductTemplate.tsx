'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '../molecules/ProductCard';
import { SearchBar } from '../molecules/SearchBar';
import { ProductFilters } from '../molecules/ProductFilters';
import { Button } from '../atomics/Button';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

export const AdminProductTemplate = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [stockRange, setStockRange] = useState<[number, number]>([0, Infinity]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
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

    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const productData = res.data?.data;

        if (Array.isArray(productData)) {
          setProducts(productData);
          setFiltered(productData);
        } else {
          console.warn('Expected array at res.data.data but got:', res.data);
          setProducts([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setFiltered([]);
      }
    };

    fetchProducts();
  }, [token]);

  const handleEdit = (product: Product) => {
    window.location.href = `/admin/products/${product.id}/edit-product`;
  };

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Product data will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      setFiltered(updated);

      Swal.fire(
        'Deleted!',
        'Product data has been deleted.',
        'success'
      );
    } catch (err) {
      console.error('Failed to delete product:', err);
      Swal.fire(
        'Error!',
        'Failed to delete product. Please try again later.',
        'error'
      );
    }
  }


  const handleSearch = (query: string) => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
  };

  const handleStockRange = (range: [number, number]) => {
    setStockRange(range);
  };

  const handlePriceRange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const finalFiltered =
    Array.isArray(filtered) &&
    filtered.filter(
      (p) =>
        (category === '' || p.category === category) &&
        p.stock >= stockRange[0] &&
        p.stock <= stockRange[1] &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

  return (
    <section className="px-8 py-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Products</h1>
      </div>

      <SearchBar onSearch={handleSearch} context="product" >
      <Button variant="primary" onClick={() => window.location.href = '/admin/products/create-product'}>Add Product</Button>
      </SearchBar>
      <ProductFilters
        categoryOptions={[...new Set(products.map((p) => p.category))]}
        onCategoryChange={handleCategory}
        onStockRangeChange={handleStockRange}
        onPriceRangeChange={handlePriceRange}
      />

        {Array.isArray(finalFiltered) && finalFiltered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(finalFiltered) &&
              finalFiltered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
            ))}
        </div>
        )}
    </section>
  );
};
