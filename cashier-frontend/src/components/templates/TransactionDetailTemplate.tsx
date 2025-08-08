'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TransactionDetail } from '@/components/organisms/TransactionDetail'
import { useAuthStore } from '@/stores/useAuthStore'
import axios from '@/lib/axios'

export const TransactionDetailTemplate = () => {
    const [token, setToken] = useState<string | null>(null)
    const router = useRouter()
    const params = useParams()
    const setActiveShiftId = useAuthStore((state) => state.setActiveShiftId)
    const shiftId = typeof params.id === 'string' ? params.id : params.id?.[0]
    const transactionId = typeof params.transactionId === 'string' ? params.transactionId : params.transactionId?.[0]

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
    }, [router, shiftId, setActiveShiftId])

    if (!token || !shiftId || !transactionId) return null

    return <TransactionDetail shiftId={shiftId} transactionId={transactionId} />
}