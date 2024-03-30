import { IBuildingWithComplex, IPossession } from './../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPossessionState, IComplex, IPosLoading } from '../../components/types';

const initialState: IPossessionState = {
  buildings: [],
  complexes: [],
  possessions: [],
  isLoading: null,
};

export const PossessionReducer = createSlice({
  name: 'PossessionReducer',
  initialState,
  reducers: {
    possessionStart: (state, { payload }: PayloadAction<IPosLoading>) => {
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
    possessionClear: (state): IPossessionState => {
      return initialState;
    },
  },
});

export const {
  possessionStart,
  complexSuccess,
  buildingSuccess,
  possessionSuccess,
  possessionClear,
} = PossessionReducer.actions;

export default PossessionReducer.reducer;
