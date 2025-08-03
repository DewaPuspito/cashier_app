'use client';

import { Modal } from '../molecules/Modal';
import { Input } from '../atomics/Input';
import { Button } from '../atomics/Button';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

interface CashierFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    email: string;
  };
  onSubmit: (data: CashierFormData) => void;
}

interface CashierFormData {
  name: string;
  email: string;
  password?: string;
}

export const CashierFormModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
}: CashierFormModalProps) => {
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
    } else {
      setFormData({ name: '', email: '', password: '' });
    }
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const isUpdate = Boolean(initialData);

  return (
    <Modal open={open} onClose={onClose} title={isUpdate ? 'Update Cashier' : 'Add Cashier'}>
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
        {!isUpdate && (
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password || ''}
            onChange={handleChange}
            required
          />
        )}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isUpdate ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
};
