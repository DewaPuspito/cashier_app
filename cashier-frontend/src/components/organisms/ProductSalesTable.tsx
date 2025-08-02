'use client'

import { SoldProduct } from "@/types/report";

type SoldProductTableProps = {
  data: SoldProduct[];
};

export const SoldProductTable = ({ data }: SoldProductTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-4 py-2 text-center">No</th>
            <th className="px-4 py-2 text-center">Product Name</th>
            <th className="px-4 py-2 text-center">Total Sold</th>
            <th className="px-4 py-2 text-center">Total Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                No product sold
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.productId}>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{i + 1}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{item.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{item.totalSold}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {item.totalRevenue.toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
