'use client';

import { useState } from 'react';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { Button } from '../atomics/Button';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export const LoginFormCashier = () => {
  const router = useRouter();
  const loginAsCashier = useAuthStore((state) => state.loginAsCashier);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/cashier/auth/login', { email, password });
      const { token, cashier } = res.data;

      localStorage.setItem('token', token);
      loginAsCashier(cashier);
      router.push('/shift');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PasswordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-lg">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Cashier Login</h2>
          <p className="text-gray-500 text-sm">Log in to Continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <InputWithLabel
            label="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            icon={<EmailIcon />}
          />
          <InputWithLabel
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            icon={<PasswordIcon />}
          />
        </div>

        <Button onClick={handleLogin}>Sign In</Button>
      </div>
    </div>
  );
};