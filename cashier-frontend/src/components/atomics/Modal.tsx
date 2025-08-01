'use client'

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <div className="text-right mt-4">
          <button onClick={onClose} className="text-blue-600 hover:underline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
