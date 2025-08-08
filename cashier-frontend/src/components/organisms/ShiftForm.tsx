'use client';

import { Button } from '@/components/atomics/Button';
import { Heading } from '@/components/atomics/Heading';
import { Input } from '@/components/atomics/Input';
import { Label } from '@/components/atomics/Label';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useAuthStore } from '@/stores/useAuthStore';

const startShiftSchema = z.object({
  startCash: z
    .number({ required_error: 'Start Cash is required' })
    .min(1, 'Start Cash must be at least 1')
    .int('Start Cash must be an integer'),
});

const endShiftSchema = z.object({
  endCash: z
    .number({ required_error: 'End Cash is required' })
    .min(1, 'End Cash must be at least 1')
    .int('End Cash must be an integer'),
});

export default function ShiftForm() {
  const [startCash, setStartCash] = useState('');
  const [endCash, setEndCash] = useState('');
  const [isShiftStarted, setIsShiftStarted] = useState(false);
  const router = useRouter();

  const activeShiftId = useAuthStore((state) => state.activeShiftId);
  const setActiveShiftId = useAuthStore((state) => state.setActiveShiftId);

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/shift/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.data) {
          const { id } = response.data.data;
          setActiveShiftId(id);
          setIsShiftStarted(true);
        } else {
          setActiveShiftId(null);
          setIsShiftStarted(false);
          setEndCash('');
        }
      } catch (error) {
        console.error('Failed to check active shift:', error);
        setActiveShiftId(null);
        setIsShiftStarted(false);
      }
    };

    checkActiveShift();
  }, [router]);

  const handleStartShift = async () => {
    try {
      if (!startCash.trim()) {
        toast.error('Start Cash is required');
        return;
      }
      
      const validatedData = startShiftSchema.parse({ startCash: Number(startCash) });
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized');
        router.push('/login');
        return;
      }

      const response = await axios.post(
        '/shift/start',
        validatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const shiftId = response.data.data.id;
      setActiveShiftId(shiftId); // Simpan ke store
      setIsShiftStarted(true);
      toast.success('Shift started successfully');
      router.push(`/cashier/shift/${shiftId}/transaction`);
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
      if (!endCash.trim()) {
        toast.error('End Cash is required');
        return;
      }

      if (!activeShiftId) {
        toast.error('No active shift found');
        return;
      }

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

      setActiveShiftId(null); // Reset store
      setIsShiftStarted(false);
      setEndCash('');
      toast.success('Shift ended successfully');
      router.push('/cashier/shift');
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-6 text-center">
        {isShiftStarted ? 'End Shift' : 'Start Shift'}
      </Heading>

      {!isShiftStarted ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="startCash">Start Cash</Label>
            <Input
              id="startCash"
              type="number"
              value={startCash}
              onChange={(e) => setStartCash(e.target.value)}
              placeholder="Enter start cash amount"
            />
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleStartShift}
          >
            Start Shift
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="endCash">End Cash</Label>
            <Input
              id="endCash"
              type="number"
              value={endCash}
              onChange={(e) => setEndCash(e.target.value)}
              placeholder="Enter end cash amount"
            />
          </div>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleEndShift}
          >
            End Shift
          </Button>
        </div>
      )}
    </div>
  );
}