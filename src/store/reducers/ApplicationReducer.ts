import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  IApplicationState,
  IError,
  IApplication,
  IType,
  IGrade,
  IPriority,
  ISource,
  IStatus,
  IEmployee,
  ISubtype,
  IGisApplication,
  IAppLoading,
} from '../../components/types';

const initialState: IApplicationState = {
  applications: [],
  gisApplications: [],
  types: [],
  grades: [],
  sources: [],
  statuses: [],
  employs: [],
  priorities: [],
  error: null,
  isLoading: null,
  subtypes: [],
};

export const ApplicationReducer = createSlice({
  name: 'ApplicationReducer',
  initialState,
  reducers: {
    applicationLoading: (state, { payload }: PayloadAction<IAppLoading>) => {
      state.isLoading = payload;
    },
    applicationSuccess: (state, { payload }: PayloadAction<IApplication[]>) => {
      state.applications = payload;
      state.isLoading = null;
    },
    gisApplicationSuccess: (state, { payload }: PayloadAction<IGisApplication[]>) => {
      state.gisApplications = payload;
      state.isLoading = null;
    },
    typesSuccess: (state, { payload }: PayloadAction<IType[]>) => {
      state.types = payload;
      state.isLoading = null;
    },
    gradesSuccess: (state, { payload }: PayloadAction<IGrade[]>) => {
      state.grades = payload;
      state.isLoading = null;
    },
    subtypesSuccess: (state, { payload }: PayloadAction<ISubtype[]>) => {
      state.subtypes = payload;
      state.isLoading = null;
    },
    prioritiesSuccess: (state, { payload }: PayloadAction<IPriority[]>) => {
      state.priorities = payload;
      state.isLoading = null;
    },
    sourcesSuccess: (state, { payload }: PayloadAction<ISource[]>) => {
      state.sources = payload;
      state.isLoading = null;
    },
    statusesSuccess: (state, { payload }: PayloadAction<IStatus[]>) => {
      state.statuses = payload;
      state.isLoading = null;
    },
    employsSuccess: (state, { payload }: PayloadAction<IEmployee[]>) => {
      state.employs = payload;
      state.isLoading = null;
    },
    applicationError: (state, { payload }: PayloadAction<IError | null>) => {
      state.error = payload;
    },
    applicationClear: (state): IApplicationState => {
      return initialState;
    },
  },
});

export const {
  applicationLoading,
  applicationSuccess,
  applicationError,
  applicationClear,
  employsSuccess,
  sourcesSuccess,
  statusesSuccess,
  typesSuccess,
  gradesSuccess,
  prioritiesSuccess,
  subtypesSuccess,
} = ApplicationReducer.actions;

export default ApplicationReducer.reducer;
