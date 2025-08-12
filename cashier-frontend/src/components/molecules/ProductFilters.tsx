'use client';

import { useState } from 'react';
import ReactSelect from'react-select';


interface ProductFiltersProps {
    categoryOptions: string[];
    onCategoryChange: (category: string) => void;
    onStockRangeChange: (range: [number, number]) => void;
    onPriceRangeChange: (range: [number, number]) => void;
    initialCategory?: string;
    initialStockRange?: [number, number];
    initialPriceRange?: [number, number];
}

export const ProductFilters = ({
  categoryOptions,
  onCategoryChange,
  onStockRangeChange,
  onPriceRangeChange,
  initialCategory = '',
  initialStockRange = [0, Infinity],
  initialPriceRange = [0, Infinity],
}: ProductFiltersProps) => {
  const [stockRangeValue, setStockRangeValue] = useState<[number, number]>(initialStockRange);
  const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>(initialPriceRange);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(() => {
    if (!initialCategory) return null;
    const formattedLabel = initialCategory
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return {
      value: initialCategory,
      label: formattedLabel
    };
  });


  const handleStockChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = [
      isMin ? value : stockRangeValue[0],
      isMin ? stockRangeValue[1] : value
    ];
    setStockRangeValue(newRange);
    onStockRangeChange(newRange);
  };

  const handlePriceChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = [
      isMin ? value : priceRangeValue[0],
      isMin ? priceRangeValue[1] : value
    ];
    setPriceRangeValue(newRange);
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
          value={selectedCategoryValue}
          onChange={(selected) => {
            const value = selected?.value ?? '';
            setSelectedCategoryValue(selected);
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
          value={stockRangeValue[0] === 0 ? '' : stockRangeValue[0]}
        />
        <span className="text-gray-900">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handleStockChange(Number(e.target.value) || Infinity, false)}
          value={stockRangeValue[1] === Infinity ? '' : stockRangeValue[1]}
        />

        <span className="text-sm text-gray-700 ml-4">Price:</span>
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handlePriceChange(Number(e.target.value) || 0, true)}
          value={priceRangeValue[0] === 0 ? '' : priceRangeValue[0]}
        />
        <span className="text-gray-900">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) => handlePriceChange(Number(e.target.value) || Infinity, false)}
          value={priceRangeValue[1] === Infinity ? '' : priceRangeValue[1]}
        />
      </div>
    </div>
  );
};