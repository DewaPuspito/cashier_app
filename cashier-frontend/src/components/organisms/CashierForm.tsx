'use client';

import { Input } from '../atomics/Input';
import { Button } from '../atomics/Button';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { CashierFormData } from '@/types/cashier';

interface CashierFormProps {
  initialData?: {
    name: string;
    email: string;
  };
  onSubmit: (data: CashierFormData) => void;
}

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
    console.log('Form data:', formData);
    onSubmit(formData);
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
