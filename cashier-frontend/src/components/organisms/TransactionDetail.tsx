import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { type TransactionDetail as TransactionDetailType } from '@/types/transaction'

interface TransactionDetailProps {
    shiftId: string
    transactionId: string
}

export function TransactionDetail({ shiftId, transactionId }: TransactionDetailProps) {
    const [transaction, setTransaction] = useState<TransactionDetailType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
  
    useEffect(() => {
      const fetchTransactionDetail = async () => {
        try {
          const response = await axios.get(`/shift/${shiftId}/transactions/${transactionId}/transaction-detail`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          if (response.data?.data) {
            setTransaction(response.data.data)
          }
          setError('')
        } catch (err) {
          setError('Failed to fetch transaction detail')
        } finally {
          setLoading(false)
        }
      }
  
      if (shiftId && transactionId) {
        fetchTransactionDetail()
      }
    }, [shiftId, transactionId])
  
    if (loading) {
        return (
          <div className="bg-white min-h-screen pt-32 px-6 pb-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )
      }
  
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )
    }
  
    if (!transaction) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500 bg-gray-50 p-6 rounded-lg shadow text-center">
            <p className="text-xl font-medium mb-2">Transaction not found</p>
            <p className="text-gray-400">The requested transaction details could not be found.</p>
          </div>
        </div>
      )
    }
  
    return (
        <div className="bg-white min-h-screen pt-32 px-6 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-black font-semibold mb-2">Transaction Detail</h2>
          </div>

          <div className="overflow-x-auto border rounded-lg bg-white shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Product</th>
                <th className="px-4 py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transaction.transactionItems?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                transaction.transactionItems?.map((item, index) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{index + 1}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{item.product?.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }