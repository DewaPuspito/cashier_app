'use client';

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
          onChange={(e) =>
            onStockRangeChange([Number(e.target.value) || 0, Infinity])
          }
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) =>
            onStockRangeChange([0, Number(e.target.value) || Infinity])
          }
        />

        <span className="text-sm text-gray-700">Price:</span>
        <input
          type="number"
          placeholder="Price"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) =>
            onPriceRangeChange([Number(e.target.value) || 0, Infinity])
          }
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Price"
          className="w-20 px-2 py-1 bg-gray-100 text-gray-900 rounded border border-black"
          onChange={(e) =>
            onPriceRangeChange([0, Number(e.target.value) || Infinity])
          }
        />
      </div>
    </div>
  );
};
