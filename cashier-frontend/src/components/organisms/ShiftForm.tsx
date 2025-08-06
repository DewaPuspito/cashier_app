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

const startShiftSchema = z.object({
  startCash: z
    .number({ required_error: 'Start Cash is required' })
    .min(0, 'Start Cash cannot be negative'),
});

const endShiftSchema = z.object({
  endCash: z
    .number({ required_error: 'End Cash is required' })
    .min(0, 'End Cash cannot be negative'),
});

export default function ShiftForm() {
  const [startCash, setStartCash] = useState('');
  const [endCash, setEndCash] = useState('');
  const [isShiftStarted, setIsShiftStarted] = useState(false);
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedShiftId = localStorage.getItem('shiftId');
    if (savedShiftId) {
      setActiveShiftId(savedShiftId);
      setIsShiftStarted(true);
    }
  }, []);

  const handleStartShift = async () => {
    try {
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

      setActiveShiftId(shiftId);
      localStorage.setItem('shiftId', shiftId);
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
      if (!token || !activeShiftId) {
        toast.error('Unauthorized');
        router.push('/login');
        return;
      }

      await axios.patch(
        `/shift/${activeShiftId}/end`,
        validatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem('shiftId');
      setActiveShiftId(null);
      setIsShiftStarted(false);
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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white">
      <Heading level={2}>{isShiftStarted ? 'End Shift' : 'Start Shift'}</Heading>

      {!isShiftStarted ? (
        <>
          <Label htmlFor="startCash" className="mt-4 block">Start Cash</Label>
          <Input
            id="startCash"
            type="number"
            value={startCash}
            onChange={(e) => setStartCash(e.target.value)}
          />
          <Button onClick={handleStartShift} className="mt-4 w-full">Start Shift</Button>
        </>
      ) : (
        <>
          <Label htmlFor="endCash" className="mt-4 block">End Cash</Label>
          <Input
            id="endCash"
            type="number"
            value={endCash}
            onChange={(e) => setEndCash(e.target.value)}
          />
          <Button onClick={handleEndShift} variant="danger" className="mt-4 w-full">
            End Shift
          </Button>
        </>
      )}
    </div>
  );
}
