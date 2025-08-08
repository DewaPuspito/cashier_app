'use client';

import ShiftForm from '../organisms/ShiftForm';

export const ShiftTemplate = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="-mt-32">
        <ShiftForm />
      </div>
    </div>
  );
};