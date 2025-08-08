import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, Cashier, User } from '../types/user';

interface AuthState {
  admin: Admin | null;
  cashier: Cashier | null;
  user: User | null;
  activeShiftId: string | null;
  loginAsAdmin: (admin: Admin) => void;
  loginAsCashier: (cashier: Cashier) => void;
  setActiveShiftId: (shiftId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      cashier: null,
      user: null,
      activeShiftId: null,

      loginAsAdmin: (admin) =>
        set({
          admin: { ...admin, role: 'ADMIN' },
          cashier: null,
          user: { ...admin, role: 'ADMIN' },
          activeShiftId: null,
        }),

      loginAsCashier: (cashier) =>
        set({
          cashier: { ...cashier, role: 'CASHIER' },
          admin: null,
          user: { ...cashier, role: 'CASHIER' },
          activeShiftId: null,
        }),

      setActiveShiftId: (shiftId) =>
        set({
          activeShiftId: shiftId,
        }),

      logout: () =>
        set({
          admin: null,
          cashier: null,
          user: null,
          activeShiftId: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        cashier: state.cashier,
        user: state.user,
        activeShiftId: state.activeShiftId
      })
    }
  )
);