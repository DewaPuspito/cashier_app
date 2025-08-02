'use client';

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { DateFilter } from "@/components/molecules/DateFilter";
import { ReportTable } from "@/components/organisms/ReportTable";
import { SoldProductTable } from "@/components/organisms/ProductSalesTable";
import { SummaryTable } from "@/components/organisms/SummaryTable";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { ShiftReport, SoldProduct, Summary } from "@/types/report";

export const AdminReportTemplate = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState<Summary | null>(null);
  const [shiftReports, setShiftReports] = useState<ShiftReport[]>([]);
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);

  const [pageShift, setPageShift] = useState(1);
  const [totalPagesShift, setTotalPagesShift] = useState(1);

  const [pageSold, setPageSold] = useState(1);
  const [totalPagesSold, setTotalPagesSold] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      try {
        const [resSummary, resItems] = await Promise.all([
          axios.get(`/daily-summary?date=${date}&page=${pageShift}&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`/daily-item?date=${date}&page=${pageSold}&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setSummary(resSummary.data.summary);
        setShiftReports(resSummary.data.shifts);
        setTotalPagesShift(resSummary.data.pagination.totalPage);

        setSoldProducts(resItems.data.items);
        setTotalPagesSold(resItems.data.pagination.totalPage);

      } catch (err) {
        console.error("Failed fetch:", err);
        setSummary(null);
        setShiftReports([]);
        setSoldProducts([]);
      }
    };
    fetchReports();
  }, [date, pageShift, pageSold]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Reports</h2>
        <DateFilter value={date} onChange={(d) => {setDate(d); setPageShift(1); setPageSold(1)}} />
        
        {summary && (
          <>
            <h2 className="text-xl font-bold text-gray-900 text-center mt-8">Summary</h2>
            <SummaryTable data={summary} />
          </>
        )}

        <h2 className="text-xl font-bold text-gray-900 text-center mt-8">Daily Shifts</h2>
        <ReportTable data={shiftReports} />
        <PaginationControls
          currentPage={pageShift}
          totalPages={totalPagesShift}
          onPageChange={setPageShift}
        />

        <h2 className="text-xl font-bold text-gray-900 text-center mt-8">Sold Products</h2>
        <SoldProductTable data={soldProducts} />
        <PaginationControls
          currentPage={pageSold}
          totalPages={totalPagesSold}
          onPageChange={setPageSold}
        />
      </div>
    </div>
  );
};
