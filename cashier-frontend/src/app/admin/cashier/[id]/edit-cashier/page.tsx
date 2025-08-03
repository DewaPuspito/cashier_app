'use client';

import { useParams } from 'next/navigation';
import { CashierFormTemplate } from '@/components/templates/CashierFormTemplate';

export default function EditCashierPage() {
  const { id } = useParams();

  if (!id || typeof id !== 'string') return null;

  return <CashierFormTemplate mode="edit" id={id} />;
}
