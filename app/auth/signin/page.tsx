'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function SigninPage() {
    const router = useRouter();
  const { data: session, status } = useSession(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  

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

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false, 
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
      
        router.push('/'); 
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back,</h1>
        
        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors mb-6">
          <FcGoogle size={24} />
          <span className="font-semibold text-gray-700">Sign In with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Dont have an account? <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}