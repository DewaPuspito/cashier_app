import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg'
  className?: string;
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl'
}

export const Heading = ({ children, level = 1, size = 'md', className = '' }: HeadingProps) => {
  const Tag = `h${level}`;
  const sizeClass = sizeMap[size] || sizeMap.md;
  return React.createElement(Tag,{ className: `${sizeClass} text-black text-center font-bold ${className}` }, children);
};