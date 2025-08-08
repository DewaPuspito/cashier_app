'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TransactionHistory } from '@/components/organisms/TransactionHistory'
import { useAuthStore } from '@/stores/useAuthStore'
import axios from '@/lib/axios'

export const TransactionHistoryTemplate = () => {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const setActiveShiftId = useAuthStore((state) => state.setActiveShiftId)
  const shiftId = typeof params.id === 'string' ? params.id : params.id?.[0]

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const savedToken = localStorage.getItem('token')
        if (!savedToken) {
          router.push('/login')
          return
        }

        const response = await axios.get('/shift/active', {
          headers: { Authorization: `Bearer ${savedToken}` }
        })

        if (response.data?.data) {
          const { id } = response.data.data
          if (id !== shiftId) {
            router.push(`/cashier/shift/${id}/transaction/history`)
          }
          setActiveShiftId(id)
          setToken(savedToken)
        } else {
          setActiveShiftId(null)
          router.push('/cashier/shift')
        }
      } catch (error) {
        console.error('Failed to check active shift:', error)
        router.push('/cashier/shift')
      }
    }

    checkActiveShift()
  }, [shiftId])

  if (!token || !shiftId) return null

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Transaction History</h1>
      <TransactionHistory shiftId={shiftId} />
    </div>
  )
}