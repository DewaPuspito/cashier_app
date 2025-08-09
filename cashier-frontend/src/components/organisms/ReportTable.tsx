'use client'

import { ShiftReport } from "@/types/report";

type ReportTableProps = {
  data: ShiftReport[];
  page: number;
  limit: number;
};


export const ReportTable = ({ data, page, limit }: ReportTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-4 py-2 text-center">Shift</th>
            <th className="px-4 py-2 text-center">Cashier</th>
            <th className="px-4 py-2 text-center">Start Cash</th>
            <th className="px-4 py-2 text-center">End Cash</th>
            <th className="px-4 py-2 text-center">Total Income</th>
            <th className="px-4 py-2 text-center">Cash Transaction</th>
            <th className="px-4 py-2 text-center">Debit Transaction</th>
            <th className="px-4 py-2 text-center">Expected End Cash</th>
            <th className="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((report, i) => (
              <tr key={report.shiftId}>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">
                  {(page - 1) * limit + i + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{report.cashier.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.startCash || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.endCash || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.totalIncome || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.cashTransaction || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.debitTransaction || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">Rp {(report.expectedEndCash || 0).toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs ${report.isMismatch ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {report.isMismatch ? 'Mismatch' : 'Match'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};