import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { Badge } from '../atomics/Badge'
import { Button } from '../atomics/Button'
import { PaginationControls } from '../molecules/PaginationControls'

interface Transaction {
  id: string
  amount: number
  paymentType: string
  createdAt: string
}

interface TransactionHistoryProps {
  shiftId: string
}

export function TransactionHistory({ shiftId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/shift/${shiftId}/transactions/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data?.data) {
          setTransactions(response.data.data)
        }
        setError('')
      } catch (err) {
        setError('Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    if (shiftId) {
      fetchTransactions()
    }
  }, [shiftId])

  const handleViewDetail = (transactionId: string) => {
    router.push(`/cashier/shift/${shiftId}/transaction/${transactionId}/transaction-detail`)
  }

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

  if (!transactions.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500 bg-gray-50 p-6 rounded-lg shadow text-center">
          <p className="text-xl font-medium mb-2">No Transactions Found</p>
          <p className="text-gray-400">There are no transactions in the current shift.</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  return (
    <div className="bg-white min-h-screen pt-20 px-6 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl text-black font-semibold mb-2">Transaction List</h2>
      </div>

      <div className="overflow-x-auto border rounded-lg bg-white shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-900">
            <tr className="text-center">
              <th className="px-4 py-2 align-middle">No</th>
              <th className="px-4 py-2 align-middle">Amount</th>
              <th className="px-4 py-2 align-middle">Payment</th>
              <th className="px-4 py-2 align-middle">Date</th>
              <th className="px-4 py-2 align-middle">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center align-middle text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="text-center">
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700">{startIndex + index + 1}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700">Rp {transaction.amount.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700">
                    <Badge color={transaction.paymentType === 'CASH' ? 'green' : 'blue'}>
                      {transaction.paymentType}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700">{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700">
                    <div className="flex justify-center">
                      <Button
                        variant="tertiary"
                        onClick={() => handleViewDetail(transaction.id)}
                      >
                        View Detail
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}