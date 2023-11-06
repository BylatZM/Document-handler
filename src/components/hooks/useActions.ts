import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { authReducer } from '../store/reducers/authReducer';
import { regReducer } from '../store/reducers/regReducer';
import { helpFormReducer } from '../store/reducers/helpFormReducer';

const rootActions = {
  ...authReducer.actions,
  ...regReducer.actions,
  ...helpFormReducer.actions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};
