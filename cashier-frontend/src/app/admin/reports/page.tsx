'use client';

import { AdminReportTemplate } from '@/components/templates/AdminReportTemplate';
import { Navbar } from '@/components/organisms/Navbar';

export default function AdminReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminReportTemplate />
    </div>
  );
}
