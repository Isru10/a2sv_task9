'use client';

import { SessionProvider } from 'next-auth/react';
import StoreProvider from '@/lib/redux/StoreProvider'; 
import AuthComponent from './AuthComponent';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <SessionProvider>
      
      <StoreProvider>

        <AuthComponent />
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}