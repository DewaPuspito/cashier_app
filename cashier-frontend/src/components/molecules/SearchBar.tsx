'use client';

import { useEffect, useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  context?: 'cashier' | 'product';
  children?: React.ReactNode;
}

export const SearchBar = ({ onSearch, context = 'cashier', children }: Props) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  const placeholderText =
    context === 'product'
      ? 'Search by product name...'
      : 'Search by name or email...';

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        placeholder={placeholderText}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[400px] px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 
        focus:ring-blue-500 text-gray-900 placeholder-gray-500 border border-black"
      />
      {children}
    </div>
  );
};
