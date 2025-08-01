'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSession, clearSession } from '@/app/service/authSlice';
import { AppDispatch } from '../service/store';

export default function AuthComponent() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch(setSession({ session, status }));
    } else if (status === 'unauthenticated') {

      dispatch(clearSession());
    }
  }, [status, session, dispatch]);


  return null;
}