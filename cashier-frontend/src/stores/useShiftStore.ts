import { create } from 'zustand';

interface ShiftState {
  shiftId: string | null;
  setShiftId: (id: string) => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
  shiftId: null,
  setShiftId: (id) => set({ shiftId: id }),
}));
