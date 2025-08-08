'use client'

import { useState, useEffect } from 'react'
import { TransactionInput } from '@/types/transaction'
import { TransactionForm } from '@/components/organisms/TransactionForm'
import { Product } from '@/types/product'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export const TransactionFormTemplate = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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

      Swal.fire({
        icon: 'success',
        title: 'Transaction successful!',
      })

      router.push(`/cashier/shift/${shiftId}/transaction/history`)
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Transaction failed',
        text: 'Please try again.',
      })
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