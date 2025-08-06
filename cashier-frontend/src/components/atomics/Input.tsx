import { InputHTMLAttributes, ReactNode, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = ({ label, icon, showPasswordToggle, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={showPasswordToggle && showPassword ? 'text' : props.type}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-900 
            placeholder-gray-400 ${props.type === 'file' ? 
            '[&::file-selector-button]:border [&::file-selector-button]:border-black [&::file-selector-button]:rounded [&::file-selector-button]:px-2 [&::file-selector-button]:py-1 [&::file-selector-button]:mr-2' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L22 22M6.71 6.71C3.97 8.68 2 12 2 12C2 12 6 20 12 20C14.05 20 15.92 19.14 17.42 17.97M19.92 19.92C21.3 18.6 22 17 22 17C22 17 22 12 12 12M9 9C9.5 8.5 10.2 8 11 8C13.76 8 16 10.24 16 13C16 13.79 15.8 14.5 15.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}
        {icon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};