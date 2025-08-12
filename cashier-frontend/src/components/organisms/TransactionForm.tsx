'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { TransactionItemInput, TransactionInput } from '@/types/transaction';
import { ProductRow } from '../molecules/ProductRow';
import { PaymentSection } from '../molecules/PaymentSection';
import { Button } from '@/components/atomics/Button';
import { z } from 'zod';

const TransactionItemSchema = z.object({
  productId: z.string().min(1, { message: 'Product is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' })
});

const TransactionSchema = z.object({
  items: z.array(TransactionItemSchema).min(1, { message: 'At least one item is required' }),
  paymentType: z.enum(['CASH', 'DEBIT']),
  shiftId: z.string(),
  cashReceived: z.number().optional(),
  cardNumber: z.string().optional()
}).refine(
  (data) => {
    if (data.paymentType === 'CASH' && data.cashReceived !== undefined) {
      const total = data.items.reduce((acc, item) => {
        return acc;
      }, 0);
      return data.cashReceived >= total;
    }
    return true;
  },
  {
    message: 'Cash received must be greater than or equal to total amount',
    path: ['cashReceived']
  }
);

interface TransactionFormProps {
  products: Product[];
  shiftId: string;
  onSubmit: (input: TransactionInput) => void;
  isSubmitting: boolean;
  onReset?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  products,
  shiftId,
  onSubmit,
  isSubmitting,
  onReset
}) => {
  const [items, setItems] = useState<TransactionItemInput[]>([
    { productId: '', quantity: 1 },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [paymentType, setPaymentType] = useState<'CASH' | 'DEBIT'>('CASH');
  const [cashReceived, setCashReceived] = useState(0);
  const [cardNumber, setCardNumber] = useState('');

  const handleItemChange = (index: number, updatedItem: TransactionItemInput) => {
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    setItems(updatedItems);
    setErrors({});
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

  const resetForm = () => {
    setItems([{ productId: '', quantity: 1 }]);
    setPaymentType('CASH');
    setCashReceived(0);
    setCardNumber('');
    setErrors({});
    onReset?.();
  };

  const handleSubmit = () => {
    const total = calculateTotal();
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

    try {
      TransactionSchema.parse({
        ...payload,
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity)
        }))
      });
      
      if (paymentType === 'CASH' && cashReceived < total) {
        setErrors({ cashReceived: 'Cash received must be greater than or equal to total amount' });
        return;
      }

      onSubmit(payload);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <ProductRow
              index={index}
              products={products}
              selectedProductId={item.productId}
              quantity={item.quantity}
              onChange={(updated: TransactionItemInput) => handleItemChange(index, updated)}
              onRemove={() => removeItemRow(index)}
              disableRemove={items.length === 1}
            />
            {errors[`items.${index}.productId`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`items.${index}.productId`]}</p>
            )}
            {errors[`items.${index}.quantity`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`items.${index}.quantity`]}</p>
            )}
          </div>
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
      {errors.cashReceived && (
        <p className="text-red-500 text-sm mt-1">{errors.cashReceived}</p>
      )}
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