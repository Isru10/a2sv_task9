'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
/* eslint-disable @typescript-eslint/no-explicit-any */

function VerifyEmailContent() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [countdown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const otpCode = otp.join('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, OTP: otpCode }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      
      router.push('/auth/signin');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify Email</h1>
        <p className="text-gray-600 mb-8">
          We have sent a verification code to the email address you provided. Please enter the code here.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You can request to <button type="button" disabled={countdown > 0} className="font-medium text-indigo-600 disabled:text-gray-400">Resend code</button> in 
            <span className="font-bold text-indigo-600"> 0:{countdown.toString().padStart(2, '0')}</span>
          </p>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full max-w-xs mx-auto py-3 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}