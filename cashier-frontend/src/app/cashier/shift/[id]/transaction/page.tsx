'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/organisms/Navbar'
import { TransactionFormTemplate } from '@/components/templates/TransactionFormTemplate'

export default function TransactionPage() {
  const { id: shiftId } = useParams()
  const router = useRouter()

  useEffect(() => {
    const savedShiftId = localStorage.getItem('shiftId')
    
    if (!savedShiftId) {
      router.push('/cashier/shift')
      return
    }

    if (shiftId !== savedShiftId) {
      router.push(`/cashier/shift/${savedShiftId}/transaction`)
    }
  }, [shiftId, router])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <TransactionFormTemplate />
    </div>
  )
}