'use client'

import { useParams } from 'next/navigation'
import { Navbar } from '@/components/organisms/Navbar'
import { TransactionFormTemplate } from '@/components/templates/TransactionFormTemplate'
import { ShiftGuard } from '@/components/molecules/ShiftGuard'

export default function TransactionPage() {
  const { id: shiftId } = useParams()

  if (!shiftId || typeof shiftId !== 'string') return null

  return (
    <ShiftGuard>
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <TransactionFormTemplate shiftId={shiftId} />
      </div>
    </ShiftGuard>
  )
}
