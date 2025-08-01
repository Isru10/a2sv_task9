'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Your Next Opportunity
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover meaningful job and volunteer opportunities that match your skills and passion. Join our community to start making a difference today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => signIn(undefined, { callbackUrl: '/LandingPage' })}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            Sign In to View Jobs
          </button>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-white text-indigo-600 font-semibold border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-transform transform hover:scale-105"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}