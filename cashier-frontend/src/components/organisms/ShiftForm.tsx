'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { Button } from '../atomics/Button';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

const startShiftSchema = z.object({
  startCash: z.number()
    .int("Start cash must be an integer")
    .nonnegative("Start cash cannot be negative")
});

const endShiftSchema = z.object({
  endCash: z.number()
    .int("End cash must be an integer")
    .nonnegative("End cash cannot be negative")
});

export const ShiftForm = () => {
  const [startCash, setStartCash] = useState('');
  const [endCash, setEndCash] = useState('');
  const [isShiftStarted, setIsShiftStarted] = useState(false);
  const [activeShiftId, setActiveShiftId] = useState('');
  const router = useRouter();

  const handleStartShift = async () => {
    try {
      const validatedData = startShiftSchema.parse({ startCash: Number(startCash) });
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized');
        router.push('/login');
        return;
      }

      const response = await axios.post('/shift/start', 
        validatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveShiftId(response.data.data.id);
      setIsShiftStarted(true);
      toast.success('Shift started successfully');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => e.message);
        toast.error(errors.join('\n'));
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to start shift');
    }
  };

  const handleEndShift = async () => {
    try {
      const validatedData = endShiftSchema.parse({ endCash: Number(endCash) });
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized');
        router.push('/login');
        return;
      }

      await axios.patch(
        `/shift/${activeShiftId}/end`,
        validatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsShiftStarted(false);
      setStartCash('');
      setEndCash('');
      toast.success('Shift ended successfully');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => e.message);
        toast.error(errors.join('\n'));
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to end shift');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-50 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {isShiftStarted ? 'End Shift' : 'Start Shift'}
      </h2>
      <div className="space-y-4">
        {!isShiftStarted ? (
          <>
          <InputWithLabel
            label="Start Cash"
            name="startCash"
            type="number"
            value={startCash}
            onChange={(e) => setStartCash(e.target.value)}
            placeholder="Enter start cash amount"
          />
          <Button
            onClick={handleStartShift}
            disabled={!startCash}
            className="w-full"
          >
            Start Shift
          </Button>
        </>
      ) : (
        <>
          <InputWithLabel
            label="End Cash"
            name="endCash"
            type="number"
            value={endCash}
            onChange={(e) => setEndCash(e.target.value)}
            placeholder="Enter end cash amount"
          />
          <Button
            onClick={handleEndShift}
            disabled={!endCash}
            className="w-full"
            variant="danger"
          >
            End Shift
          </Button>
        </>
        )}
      </div>
    </div>
  );
};