// src/stores/useAuthStore.ts

import { create } from 'zustand';
import { Admin, Cashier, User } from '../types/user';

interface AuthState {
  admin: Admin | null;
  cashier: Cashier | null;
  loginAsAdmin: (admin: Admin) => void;
  loginAsCashier: (cashier: Cashier) => void;
  logout: () => void;
  user: User | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  cashier: null,

  get user() {
    return get().admin ?? get().cashier;
  },

  loginAsAdmin: (admin) =>
    set({
      admin: { ...admin, role: 'ADMIN' },
      cashier: null,
    }),

  loginAsCashier: (cashier) =>
    set({
      cashier: { ...cashier, role: 'CASHIER' },
      admin: null,
    }),

  logout: () => set({ admin: null, cashier: null }),
}));
