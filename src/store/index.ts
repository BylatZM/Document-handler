import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { AuthReducer } from './reducers/AuthReducer';
import { RegReducer } from './reducers/RegReducer';
import { StoreState } from '../components/types';
import { HelpFormReducer } from './reducers/HelpFormReducer';
import { UserReducer } from './reducers/UserReducer';
import { CitizenReducer } from './reducers/CitizenReducer';
import { PossessionReducer } from './reducers/PossessionReducer';
import { ApplicationReducer } from './reducers/ApplicationReducer';

const reducers = combineReducers<StoreState>({
  AuthReducer: AuthReducer.reducer,
  RegReducer: RegReducer.reducer,
  HelpFormReducer: HelpFormReducer.reducer,
  UserReducer: UserReducer.reducer,
  CitizenReducer: CitizenReducer.reducer,
  PossessionReducer: PossessionReducer.reducer,
  ApplicationReducer: ApplicationReducer.reducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...(process.env.NODE_ENV !== 'production' ? [logger] : [])),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
