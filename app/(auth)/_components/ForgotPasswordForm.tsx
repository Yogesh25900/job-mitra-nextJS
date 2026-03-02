"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleSendPasswordResetOTP } from '@/lib/actions/talent-action';

type ForgotPasswordRole = 'candidate' | 'employer';

interface ForgotPasswordFormProps {
  role: ForgotPasswordRole;
}

export default function ForgotPasswordForm({ role }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const loginPath = role === 'candidate' ? '/talent/login' : '/recruiter/login';
  const switchForgotPath = role === 'candidate' ? '/recruiter/forgot-password' : '/talent/forgot-password';
  const switchForgotLabel = role === 'candidate' ? 'Are you an Employer?' : 'Are you a Talent User?';
  const switchForgotAction = role === 'candidate' ? 'Reset Employer Password' : 'Reset Talent Password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const response = await handleSendPasswordResetOTP(email, role);

    console.log('OTP Response:', response);
    if (response && response.success) {
      setMessage('OTP sent! Check your email.');
      setIsError(false);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&usertype=${role}`);
    } else {
      setMessage(response?.message || 'Something went wrong.');
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl sm:p-8 transition-colors">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Forgot Your Password?</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
            <p className="mt-3 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 inline-block px-3 py-1 rounded-full">
              {role === 'candidate' ? 'Candidate Account Reset' : 'Employer Account Reset'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm sm:leading-6 transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>

            {message && (
              <p className={`text-center text-sm mt-2 ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link
              href={loginPath}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-opacity hover:opacity-80"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {switchForgotLabel}{' '}
              <Link href={switchForgotPath} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {switchForgotAction}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
