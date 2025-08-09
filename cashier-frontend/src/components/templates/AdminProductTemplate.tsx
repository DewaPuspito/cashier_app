'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '../molecules/ProductCard';
import { SearchBar } from '../molecules/SearchBar';
import { ProductFilters } from '../molecules/ProductFilters';
import { PaginationControls } from '../molecules/PaginationControls';
import { Button } from '../atomics/Button';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

export const AdminProductTemplate = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [category, setCategory] = useState('');
  const [stockRange, setStockRange] = useState<[number, number]>([0, Infinity]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [searchQuery, setSearchQuery] = useState('');

  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Ambil token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      console.warn('Token not found.');
      return;
    }
    setToken(savedToken);
  }, []);

  // Fetch products per halaman + filter
  const fetchProducts = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        category: category || undefined,
      };

      // Range stock & price hanya dikirim kalau user isi filter
      if (stockRange[0] !== 0 || stockRange[1] !== Infinity) {
        params.stockMin = stockRange[0];
        params.stockMax = stockRange[1];
      }
      if (priceRange[0] !== 0 || priceRange[1] !== Infinity) {
        params.priceMin = priceRange[0];
        params.priceMax = priceRange[1];
      }

      const res = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setProducts(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
  }, [token, currentPage, searchQuery, category, stockRange, priceRange]);

  // Edit product
  const handleEdit = (product: Product) => {
    window.location.href = `/admin/products/${product.id}/edit-product`;
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Product data will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire('Deleted!', 'Product data has been deleted.', 'success');
      fetchProducts(); // refresh list
    } catch (err) {
      console.error('Failed to delete product:', err);
      Swal.fire(
        'Error!',
        'Failed to delete product. Please try again later.',
        'error'
      );
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <section className="px-8 py-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Products</h1>
      </div>

      <SearchBar onSearch={setSearchQuery} context="product">
        <Button
          variant="primary"
          onClick={() => (window.location.href = '/admin/products/create-product')}
        >
          Add Product
        </Button>
      </SearchBar>

      <ProductFilters
        categoryOptions={products
          .map(p => p.category)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(category => {
            return category
              .toLowerCase()
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('');
          })}
        onCategoryChange={(cat) => {
          const originalFormat = cat
            .split(/(?=[A-Z])/)
            .join('_')
            .toUpperCase();
          setCategory(originalFormat);
          setCurrentPage(1);
        }}
        onStockRangeChange={(range) => {
          setStockRange(range);
          setCurrentPage(1);
        }}
        onPriceRangeChange={(range) => {
          setPriceRange(range);
          setCurrentPage(1);
        }}
      />

      {Array.isArray(products) && products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};