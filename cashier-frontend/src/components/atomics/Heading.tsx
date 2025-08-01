import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Heading = ({ children, level = 1, className = '' }: HeadingProps) => {
  const Tag = `h${level}`;
  return React.createElement(Tag, { className: `text-center font-bold ${className}` }, children);
};