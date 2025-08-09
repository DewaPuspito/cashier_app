'use client';

import { useState } from 'react';
import ReactSelect from'react-select';


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
  const [selectedCategory, setSelectedCategory] = useState<{ label: string; value: string } | null>(null);

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

  const categoryOptionsFormatted = [
    { value: '', label: 'All Categories' },
    ...categoryOptions.map((cat) => ({
      value: cat,
      label: cat.split(/(?=[A-Z])/).join(' ')
    })),
  ];

  return (
    <div className="flex items-center gap-6 mb-6">
      <div className="w-48">
        <ReactSelect
          isSearchable={false}
          options={categoryOptionsFormatted}
          value={selectedCategory}
          onChange={(selected) => {
            const value = selected?.value ?? '';
            setSelectedCategory(selected);
            onCategoryChange(value);
          }}
          className="text-black border-black"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-700">Stock:</span>
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handleStockChange(Number(e.target.value) || 0, true)}
          value={stockRange[0] === 0 ? '' : stockRange[0]}
        />
        <span className="text-gray-900">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handleStockChange(Number(e.target.value) || Infinity, false)}
          value={stockRange[1] === Infinity ? '' : stockRange[1]}
        />

        <span className="text-sm text-gray-700 ml-4">Price:</span>
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handlePriceChange(Number(e.target.value) || 0, true)}
          value={priceRange[0] === 0 ? '' : priceRange[0]}
        />
        <span className="text-gray-900">-</span>
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