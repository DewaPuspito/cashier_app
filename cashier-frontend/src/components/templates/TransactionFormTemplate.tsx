'use client'

import { useState, useEffect } from 'react'
import { TransactionInput } from '@/types/transaction'
import { TransactionForm } from '@/components/organisms/TransactionForm'
import { Product } from '@/types/product'
import axios from '@/lib/axios'
import toast from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

export const TransactionFormTemplate = () => {
  const params = useParams()
  const activeShiftId = useAuthStore((state) => state.activeShiftId)
  const shiftId = typeof params.id === 'string' ? params.id : params.id?.[0] || activeShiftId || ''
  const [products, setProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    
    if (!savedToken) {
      router.push('/cashier/shift')
      return
    }
    
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!shiftId) {
      router.push('/cashier/shift')
      return
    }
  }, [shiftId])

  useEffect(() => {
    if (!token) return

    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const productData = res.data?.data
        if (Array.isArray(productData)) {
          setProducts(productData)
        } else {
          console.warn('Expected array at res.data.data but got:', res.data)
          setProducts([])
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setProducts([])
      }
    }

    fetchProducts()
  }, [token])

  const handleSubmit = async (formData: TransactionInput) => {
    if (!token || !shiftId) return

    setIsSubmitting(true)

    try {
      await axios.post(`/shift/${shiftId}/transactions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success('Transaction successful!')
      router.push(`/cashier/shift/${shiftId}/transaction`)
    } catch (error) {
      console.error(error)
      toast.error('Transaction failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!shiftId) return null

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">New Transaction</h1>
      <TransactionForm
        products={products}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        shiftId={shiftId}
      />
    </div>
  )
}