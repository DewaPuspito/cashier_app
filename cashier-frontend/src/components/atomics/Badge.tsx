import React from 'react';

interface BadgeProps {
  color?: 'green' | 'red' | 'gray' | 'blue';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ color = 'gray', children }) => {
  const colorMap = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${colorMap[color]}`}>
      {children}
    </span>
  );
};
