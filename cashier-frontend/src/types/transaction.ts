export type TransactionItemInput = {
    productId: string
    quantity: number
  }
  
  export type TransactionInput = {
    items: TransactionItemInput[]
    paymentType: 'CASH' | 'DEBIT'
    cashReceived?: number
    cardNumber?: string
    shiftId: string
  }
  
  export type TransactionQuery = {
    date?: string
    shiftId?: string
    page?: number
    limit?: number
  }

  export type TransactionDetail = {
    id: string
    amount: number
    paymentType: string
    createdAt: string
    transactionItems: {
        id: string
        quantity: number
        product: {
            name: string
            price: number
        }
    }[]
    cashier: {
        name: string
        email: string
    }
}
  