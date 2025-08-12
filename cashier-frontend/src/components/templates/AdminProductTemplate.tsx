'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductCard } from '../molecules/ProductCard';
import { SearchBar } from '../molecules/SearchBar';
import { ProductFilters } from '../molecules/ProductFilters';
import { PaginationControls } from '../molecules/PaginationControls';
import { Button } from '../atomics/Button';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

export const AdminProductTemplate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [stockRange, setStockRange] = useState<[number, number]>([
    Number(searchParams.get('stockMin')) || 0,
    Number(searchParams.get('stockMax')) || Infinity
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('priceMin')) || 0,
    Number(searchParams.get('priceMax')) || Infinity
  ]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [token, setToken] = useState<string | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      console.warn('Token not found.');
      return;
    }
    setToken(savedToken);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchQuery || undefined,
          limit: 1000
        },
      });

      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (stockRange[0] !== 0 || stockRange[1] !== Infinity) {
      filtered = filtered.filter(
        product => 
          product.stock >= stockRange[0] && 
          (stockRange[1] === Infinity || product.stock <= stockRange[1])
      );
    }

    if (priceRange[0] !== 0 || priceRange[1] !== Infinity) {
      filtered = filtered.filter(
        product => 
          product.price >= priceRange[0] && 
          (priceRange[1] === Infinity || product.price <= priceRange[1])
      );
    }

    setFilteredProducts(filtered);
    setTotal(filtered.length);
    setCurrentPage(1);
  }, [products, category, stockRange, priceRange]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (!token) return;
    fetchProducts();
  }, [token, searchQuery]);

  const handleEdit = (product: Product) => {
    window.location.href = `/admin/products/${product.id}/edit-product`;
  };

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Product data will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire('Deleted!', 'Product data has been deleted.', 'success');
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      Swal.fire(
        'Error!',
        'Failed to delete product. Please try again later.',
        'error'
      );
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (searchQuery) params.set('search', searchQuery);
    if (stockRange[0] > 0) params.set('stockMin', stockRange[0].toString());
    if (stockRange[1] !== Infinity) params.set('stockMax', stockRange[1].toString());
    if (priceRange[0] > 0) params.set('priceMin', priceRange[0].toString());
    if (priceRange[1] !== Infinity) params.set('priceMax', priceRange[1].toString());
    if (currentPage > 1) params.set('page', currentPage.toString());

    const query = params.toString();
    router.push(query ? `?${query}` : window.location.pathname);
  };

  useEffect(() => {
    updateURL();
  }, [category, stockRange, priceRange, searchQuery, currentPage]);

  return (
    <section className="px-8 py-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Products</h1>
      </div>

      <SearchBar onSearch={setSearchQuery} context="product" initialSearchValue={searchQuery}>
        <Button
          variant="primary"
          onClick={() => (window.location.href = '/admin/products/create-product')}
        >
          + Add Product
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
        initialCategory={category}
        initialStockRange={stockRange}
        initialPriceRange={priceRange}
        onCategoryChange={(cat) => {
          const originalFormat = cat
            .split(/(?=[A-Z])/)
            .join('_')
            .toUpperCase();
          setCategory(originalFormat);
        }}
        onStockRangeChange={(range) => {
          setStockRange([Number(range[0]), Number(range[1])]);
        }}
        onPriceRangeChange={(range) => {
          setPriceRange([Number(range[0]), Number(range[1])]);
        }}
      />

      {displayedProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
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
        totalPages={Math.ceil(total / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};