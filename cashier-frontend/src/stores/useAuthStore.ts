import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, Cashier, User } from '../types/user';

interface AuthState {
  admin: Admin | null;
  cashier: Cashier | null;
  user: User | null;
  loginAsAdmin: (admin: Admin) => void;
  loginAsCashier: (cashier: Cashier) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      cashier: null,
      user: null,

      loginAsAdmin: (admin) =>
        set({
          admin: { ...admin, role: 'ADMIN' },
          cashier: null,
          user: { ...admin, role: 'ADMIN' },
        }),

      loginAsCashier: (cashier) =>
        set({
          cashier: { ...cashier, role: 'CASHIER' },
          admin: null,
          user: { ...cashier, role: 'CASHIER' },
        }),

      logout: () =>
        set({
          admin: null,
          cashier: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
