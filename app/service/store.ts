import { configureStore } from '@reduxjs/toolkit';
import { jobApi } from './jobListing';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [jobApi.reducerPath]: jobApi.reducer,
        auth: authReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;