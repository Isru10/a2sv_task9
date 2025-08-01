'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FieldValues } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from 'next-auth/react';
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function SignupPage() {

  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  

  useEffect(() => {

    if (status === 'authenticated') {

      router.push('/');
    }
  }, [status, router]);


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  const passwordValue = watch('password');

  const onSubmit = async (values: FieldValues) => {
    setApiError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: 'user'
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);

    } catch (err: any) {
      setApiError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up Today!</h1>
        
        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })} 
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FcGoogle size={24} />
          <span className="font-semibold text-gray-700">Sign Up with Google</span>
        </button>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Or Sign Up with Email</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              {...register('name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Full name must be at least 2 characters' }
              })} 
              type="text" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })} 
              type="email" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })} 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === passwordValue || 'Passwords do not match'
              })} 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
            />
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message as string}</p>}
          </div>

          {apiError && <p className="text-sm text-red-600">{apiError}</p>}
          
          <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link></p>
        <p className="mt-4 text-xs text-center text-gray-500">By clicking ‘Continue’, you acknowledge our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </div>
    </div>
  );
}