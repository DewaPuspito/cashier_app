'use client';

import React from 'react';
import { Input } from '@/components/atomics/Input';
import { Label } from '@/components/atomics/Label';
import ReactSelect from 'react-select';

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
        <ReactSelect
          className="text-black w-1/3 mt-4 border-black"
          value={[
            { value: 'CASH', label: 'Cash' },
            { value: 'DEBIT', label: 'Debit' },
          ].find((opt) => opt.value === paymentType) || null}
          onChange={(option) => {
            if (option) {
              onPaymentTypeChange(option.value as 'CASH' | 'DEBIT');
            }
          }}
          options={[
            { value: 'CASH', label: 'Cash' },
            { value: 'DEBIT', label: 'Debit' },
          ]}
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
