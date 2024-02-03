import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { AuthReducer } from '../../store/reducers/AuthReducer';
import { RegReducer } from '../../store/reducers/RegReducer';
import { HelpFormReducer } from '../../store/reducers/HelpFormReducer';
import { UserReducer } from '../../store/reducers/UserReducer';
import { CitizenReducer } from '../../store/reducers/CitizenReducer';
import { PossessionReducer } from './../../store/reducers/PossessionReducer';
import { ApplicationReducer } from '../../store/reducers/ApplicationReducer';

const rootActions = {
  ...AuthReducer.actions,
  ...RegReducer.actions,
  ...HelpFormReducer.actions,
  ...UserReducer.actions,
  ...CitizenReducer.actions,
  ...PossessionReducer.actions,
  ...ApplicationReducer.actions,
};

export type useActionType = typeof rootActions;

export const useActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};
