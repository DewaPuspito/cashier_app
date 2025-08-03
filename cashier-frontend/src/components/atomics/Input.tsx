import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
};
