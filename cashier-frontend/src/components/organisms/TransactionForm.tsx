'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { TransactionItemInput, TransactionInput } from '@/types/transaction';
import { ProductRow } from '../molecules/ProductRow';
import { PaymentSection } from '../molecules/PaymentSection';
import { Button } from '@/components/atomics/Button';

interface TransactionFormProps {
  products: Product[];
  shiftId: string;
  onSubmit: (input: TransactionInput) => void;
  isSubmitting: boolean
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  products,
  shiftId,
  onSubmit,
  isSubmitting
}) => {
  const [items, setItems] = useState<TransactionItemInput[]>([
    { productId: '', quantity: 1 },
  ]);

  const [paymentType, setPaymentType] = useState<'CASH' | 'DEBIT'>('CASH');
  const [cashReceived, setCashReceived] = useState(0);
  const [cardNumber, setCardNumber] = useState('');

  const handleItemChange = (index: number, updatedItem: TransactionItemInput) => {
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = () => {
    const payload: TransactionInput = {
      items,
      paymentType,
      shiftId,
    };

    if (paymentType === 'CASH') {
      payload.cashReceived = cashReceived;
    } else {
      payload.cardNumber = cardNumber;
    }

    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <ProductRow
            key={index}
            index={index}
            products={products}
            selectedProductId={item.productId}
            quantity={item.quantity}
            onChange={(updated: TransactionItemInput) => handleItemChange(index, updated)}
            onRemove={() => removeItemRow(index)}
            disableRemove={items.length === 1}
          />
        ))}
        <Button variant="primary" onClick={addItemRow}>
          Add Product
        </Button>
      </div>

      <hr />
      <PaymentSection
        paymentType={paymentType}
        cashReceived={cashReceived}
        cardNumber={cardNumber}
        totalAmount={calculateTotal()}
        onPaymentTypeChange={setPaymentType}
        onCashChange={setCashReceived}
        onCardNumberChange={setCardNumber}
      />
      <hr />

      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-black">Total: Rp {calculateTotal().toLocaleString()}</p>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Checkout'}
        </Button>
      </div>
    </div>
  );
};
