'use client';

import React from 'react';
import { Input } from '@/components/atomics/Input';
import { Label } from '@/components/atomics/Label';
import { Select } from '@/components/atomics/Select';

interface PaymentSectionProps {
  paymentType: 'CASH' | 'DEBIT';
  cashReceived: number;
  cardNumber: string;
  totalAmount: number;
  onPaymentTypeChange: (value: 'CASH' | 'DEBIT') => void;
  onCashChange: (value: number) => void;
  onCardNumberChange: (value: string) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentType,
  cashReceived,
  cardNumber,
  totalAmount,
  onPaymentTypeChange,
  onCashChange,
  onCardNumberChange,
}) => {
  const change = paymentType === 'CASH' ? cashReceived - totalAmount : 0;

  return (
    <div className="space-y-4 mt-6">
      <div>
        <Label htmlFor="paymentType">Payment Method</Label>
        <Select
          value={paymentType}
          onChange={(e) => onPaymentTypeChange(e.target.value as 'CASH' | 'DEBIT')}
          options={[
            { value: 'CASH', label: 'Cash' },
            { value: 'DEBIT', label: 'Debit' },
          ]}
          className="text-black"
        />
      </div>

      {paymentType === 'CASH' ? (
        <div>
          <Label htmlFor="cashReceived">Cash Received</Label>
          <Input
            id="cashReceived"
            type="number"
            value={cashReceived}
            onChange={(e) => onCashChange(parseFloat(e.target.value))}
            min={0}
          />
          <p className="text-sm mt-1 text-gray-800">
            Change: <span className="font-semibold">{change < 0 ? 0 : change.toFixed(2)}</span>
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            placeholder="Enter card number"
          />
        </div>
      )}
    </div>
  );
};
