import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { authReducer } from '../store/reducers/authReducer';
import { regReducer } from '../store/reducers/regReducer';

const rootActions = {
  ...authReducer.actions,
  ...regReducer.actions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};
