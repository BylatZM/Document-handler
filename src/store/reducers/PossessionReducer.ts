import { IBuildingWithComplex, IError, IPossession } from './../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPossessionState, IComplex, IPosLoading } from '../../components/types';

const initialState: IPossessionState = {
  buildings: [],
  complexes: [],
  possessions: [],
  isLoading: null,
  error: null,
};

export const PossessionReducer = createSlice({
  name: 'PossessionReducer',
  initialState,
  reducers: {
    possessionLoading: (state, { payload }: PayloadAction<IPosLoading>) => {
      state.isLoading = payload;
    },
    complexSuccess: (state, { payload }: PayloadAction<IComplex[]>) => {
      state.complexes = payload;
      state.isLoading = null;
    },
    buildingSuccess: (state, { payload }: PayloadAction<IBuildingWithComplex[]>) => {
      state.buildings = payload;
      state.isLoading = null;
    },
    possessionSuccess: (state, { payload }: PayloadAction<IPossession[]>) => {
      state.possessions = payload;
      state.isLoading = null;
    },
    possessionError: (state, { payload }: PayloadAction<null | IError>) => {
      state.error = payload;
    },
    possessionClear: (state): IPossessionState => {
      return initialState;
    },
  },
});

export const {
  possessionLoading,
  complexSuccess,
  buildingSuccess,
  possessionSuccess,
  possessionClear,
  possessionError,
} = PossessionReducer.actions;

export default PossessionReducer.reducer;
