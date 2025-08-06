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
  