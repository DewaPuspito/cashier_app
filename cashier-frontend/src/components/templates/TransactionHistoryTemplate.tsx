'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TransactionHistory } from '@/components/organisms/TransactionHistory'

export const TransactionHistoryTemplate = () => {
  const [token, setToken] = useState<string | null>(null)
  const [shiftId, setShiftId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedShiftId = localStorage.getItem('shiftId')
    
    if (!savedToken || !savedShiftId) {
      router.push('/cashier/shift')
      return
    }
    
    setToken(savedToken)
    setShiftId(savedShiftId)
  }, [])

  if (!token || !shiftId) return null

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Transaction History</h1>
      <TransactionHistory shiftId={shiftId} />
    </div>
  )
}