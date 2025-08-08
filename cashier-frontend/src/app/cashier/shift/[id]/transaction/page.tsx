'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/organisms/Navbar'
import { TransactionFormTemplate } from '@/components/templates/TransactionFormTemplate'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter, useParams } from 'next/navigation'
import axios from '@/lib/axios'

export default function TransactionPage() {
  const router = useRouter()
  const params = useParams()
  const setActiveShiftId = useAuthStore((state) => state.setActiveShiftId)
  const shiftId = typeof params.id === 'string' ? params.id : params.id?.[0]

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await axios.get('/shift/active', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data?.data) {
          const { id } = response.data.data
          if (id !== shiftId) {
            router.push(`/cashier/shift/${id}/transaction`)
          }
          setActiveShiftId(id)
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <TransactionFormTemplate />
    </div>
  )
}