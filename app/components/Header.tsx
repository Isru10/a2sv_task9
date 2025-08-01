'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            JobBoard
          </Link>

          <div className="flex items-center gap-4">
            {status === 'authenticated' ? (
              <>

                <Link href="/Bookmarked" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                  My Bookmarks
                </Link>

                <div className="flex items-center gap-2">
                  <Image
                    src={session.user?.image || '/vercel.svg'}
                    alt={session.user?.name || 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-600"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}