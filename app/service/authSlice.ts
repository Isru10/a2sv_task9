import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session } from 'next-auth';
import { RootState } from './store';

interface AuthState {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
  session: null,
  status: 'loading', 
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthState>) => {
      state.session = action.payload.session;
      state.status = action.payload.status;
    },

    clearSession: (state) => {
      state.session = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;


export const selectSession = (state: RootState) => state.auth.session;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectUser = (state: RootState) => state.auth.session?.user;

export default authSlice.reducer;