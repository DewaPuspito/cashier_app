'use client';

import { useState } from 'react';

interface ProductFiltersProps {
    categoryOptions: string[];
    onCategoryChange: (category: string) => void;
    onStockRangeChange: (range: [number, number]) => void;
    onPriceRangeChange: (range: [number, number]) => void;
}

export const ProductFilters = ({
  categoryOptions,
  onCategoryChange,
  onStockRangeChange,
  onPriceRangeChange,
}: ProductFiltersProps) => {
  const [stockRange, setStockRange] = useState<[number, number]>([0, Infinity]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);

  const handleStockChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = [
      isMin ? value : stockRange[0],
      isMin ? stockRange[1] : value
    ];
    setStockRange(newRange);
    onStockRangeChange(newRange);
  };

  const handlePriceChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = [
      isMin ? value : priceRange[0],
      isMin ? priceRange[1] : value
    ];
    setPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  return (
    <div className="flex items-center gap-6 mb-6">
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900"
      >
        <option value="">All Categories</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Stock:</span>
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handleStockChange(Number(e.target.value) || 0, true)}
          value={stockRange[0] === 0 ? '' : stockRange[0]}
        />
        <span className='text-gray-900'>-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handleStockChange(Number(e.target.value) || Infinity, false)}
          value={stockRange[1] === Infinity ? '' : stockRange[1]}
        />

        <span className="text-sm text-gray-700">Price:</span>
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handlePriceChange(Number(e.target.value) || 0, true)}
          value={priceRange[0] === 0 ? '' : priceRange[0]}
        />
        <span className='text-gray-900'>-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handlePriceChange(Number(e.target.value) || Infinity, false)}
          value={priceRange[1] === Infinity ? '' : priceRange[1]}
        />
      </div>
    </div>
  );
};