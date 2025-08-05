'use client';

import { useParams } from 'next/navigation';
import { ProductFormTemplate } from '@/components/templates/AdminProductFormTemplate';
import { Navbar } from '@/components/organisms/Navbar';

export default function EditCashierPage() {
  const { id } = useParams();

  if (!id || typeof id !== 'string') return null;

return (
  <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ProductFormTemplate mode="edit" id={id} />;
    </div>
)
}
