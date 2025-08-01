'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import BookmarkList from '@/app/components/BookmarkList'; 

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BookmarkedPage() {
  const { status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Verifying session...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <Header />
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Bookmarked Opportunities</h1>
          
          
          </div>
          
          
          
          <BookmarkList />
        </div>
      </div>
    );
  }


  return null;
}