'use client';

import { useParams } from 'next/navigation';
import { CashierFormTemplate } from '@/components/templates/CashierFormTemplate';
import { Navbar } from '@/components/organisms/Navbar';

export default function EditCashierPage() {
  const { id } = useParams();

  if (!id || typeof id !== 'string') return null;

return (
  <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <CashierFormTemplate mode="edit" id={id} />;
    </div>
)
}
