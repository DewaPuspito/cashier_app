'use client';

import { Button } from '../atomics/Button';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  onAdd: () => void;
}

export const CashierFilterBar = ({ onSearch, onAdd }: Props) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[400px] px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        />
        <Button variant="secondary" onClick={handleSearch} className="px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg">
          Search
        </Button>
      </div>
      <Button variant="primary" onClick={onAdd} className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        + Add Cashier
      </Button>
    </div>
  );
};