import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export const Input = ({ label, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
      <input
          {...props}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-900 
            placeholder-gray-400 ${props.type === 'file' ? 
            '[&::file-selector-button]:border [&::file-selector-button]:border-black [&::file-selector-button]:rounded [&::file-selector-button]:px-2 [&::file-selector-button]:py-1 [&::file-selector-button]:mr-2' : ''}`}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};