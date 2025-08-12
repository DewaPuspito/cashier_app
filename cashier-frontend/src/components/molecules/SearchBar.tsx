'use client';

import { useEffect, useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  context?: 'cashier' | 'product';
  children?: React.ReactNode;
  initialSearchValue?: string;
}

export const SearchBar = ({ 
  onSearch, 
  context = 'cashier', 
  children,
  initialSearchValue = '' 
}: Props) => {
  const [searchQueryValue, setSearchQueryValue] = useState(initialSearchValue);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchQueryValue.trim());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQueryValue, onSearch]);

  const placeholderText =
    context === 'product'
      ? 'Search by product name...'
      : 'Search by name or email...';

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        placeholder={placeholderText}
        value={searchQueryValue}
        onChange={(e) => setSearchQueryValue(e.target.value)}
        className="w-[400px] px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 
        focus:ring-blue-500 text-gray-900 placeholder-gray-500 border border-black"
      />
      {children}
    </div>
  );
};
