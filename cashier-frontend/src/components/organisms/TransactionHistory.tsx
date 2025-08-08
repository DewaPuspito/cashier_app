import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { Button } from '../atomics/Button'
import { PaginationControls } from '../molecules/PaginationControls'

interface Transaction {
  id: string
  amount: number
  paymentType: string
  createdAt: string
  cashier: {
    name: string
    email: string
  }
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
      <div className="flex justify-center items-center min-h-[400px]">
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
    <div className="bg-white min-h-screen pt-24 px-6 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl text-black font-semibold mb-2">Transaction List</h2>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th scope="col" className="w-[10%] px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th scope="col" className="w-[25%] px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="w-[20%] px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th scope="col" className="w-[25%] px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="w-[20%] px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-5 whitespace-nowrap text-sm text-center text-gray-900">{startIndex + index + 1}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-center text-gray-900">Rp {transaction.amount.toLocaleString()}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-center">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${transaction.paymentType.toLowerCase() === 'cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {transaction.paymentType}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-center text-gray-900">
                  {new Date(transaction.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-center">
                  <Button
                    variant="tertiary"
                    onClick={() => handleViewDetail(transaction.id)}
                    className="text-sm px-4 py-2 w-28 mx-auto"
                  >
                    View Detail
                  </Button>
                </td>
              </tr>
            ))}
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