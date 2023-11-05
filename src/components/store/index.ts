import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { authReducer } from './reducers/authReducer';
import { regReducer } from './reducers/regReducer';
import { StoreState } from '../types';

const reducers = combineReducers<StoreState>({
  AuthReducer: authReducer.reducer,
  RegReducer: regReducer.reducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...(process.env.NODE_ENV !== 'production' ? [logger] : [])),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
