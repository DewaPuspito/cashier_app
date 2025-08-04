'use client';

import { Cashier } from '@/types/user';
import { Button } from '../atomics/Button';

interface Props {
  data: Cashier[];
  onEdit: (cashier: Cashier) => void;
  onDelete: (id: string) => void;
}

export const CashierTable = ({ data, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow">
    <table className="min-w-full text-sm text-left text-gray-700">
    <thead className="bg-gray-100 text-gray-900">
        <tr>
          <th className="w-16 px-4 py-2 text-center">No</th>
          <th className="w-1/3 px-4 py-2 text-center">Name</th>
          <th className="w-1/3 px-4 py-2 text-center">Email</th>
          <th className="w-1/4 px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((cashier, index) => (
            <tr key={cashier.id}>
            <td className="px-4 py-3 text-center text-gray-700">{index + 1}</td>
            <td className="px-4 py-3 text-center text-gray-700">{cashier.name}</td>
            <td className="px-4 py-3 text-center text-gray-700">{cashier.email}</td>
            <td className="px-4 py-2 text-center">
            <div className="flex justify-center gap-2">
                <Button variant="secondary" onClick={() => onEdit(cashier)}>
                Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(cashier.id)}>
                Delete
                </Button>
            </div>
            </td>
          </tr>
        ))
        ) : (
        <tr>
          <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
            No data available
          </td>
        </tr>
        )}
      </tbody>
    </table>
  </div>
  );
};
