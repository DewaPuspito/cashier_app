'use client';

import { Input } from '../atomics/Input';
import { Button } from '../atomics/Button';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { CashierFormData } from '@/types/cashier';
import {toast} from 'react-hot-toast';
import { z } from 'zod';

interface CashierFormProps {
  initialData?: {
    name: string;
    email: string;
  };
  onSubmit: (data: CashierFormData) => void;
}

const createCashierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const updateCashierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal(''))
});

export const CashierForm = ({ initialData, onSubmit }: CashierFormProps) => {
  const [formData, setFormData] = useState<CashierFormData>({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const schema = initialData ? updateCashierSchema : createCashierSchema;
      const validatedData = schema.parse(formData);
      onSubmit(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => e.message);
        toast.error(errors.join('\n'));
      }
    }
  };

  const isUpdate = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder={isUpdate ? '(Leave blank to keep current password)' : 'Enter password'}
          value={formData.password}
          onChange={handleChange}
          required={!isUpdate}
        />
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="submit">{isUpdate ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
};
