import React from 'react';

type LabelProps = {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}

export const Label = ({ children, className, htmlFor }: LabelProps) => (
  <label htmlFor={htmlFor} className={`text-black ${className || ''}`}>{children}</label>
)
