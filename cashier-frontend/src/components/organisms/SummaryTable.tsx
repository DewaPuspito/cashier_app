'use client'

import React from "react";
import { Summary } from "@/types/report";

interface Props {
  data: Summary;
}

export const SummaryTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-4 py-2 text-center">Total Transactions</th>
            <th className="px-4 py-2 text-center">Total Income</th>
            <th className="px-4 py-2 text-center">Total Cash</th>
            <th className="px-4 py-2 text-center">Total Debit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 text-center">{data.totalTransactions}</td>
            <td className="px-4 py-2 text-center">Rp {data.totalDebit.toLocaleString()}</td>
            <td className="px-4 py-2 text-center">Rp {data.totalDebit.toLocaleString()}</td>
            <td className="px-4 py-2 text-center">Rp {data.totalDebit.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
