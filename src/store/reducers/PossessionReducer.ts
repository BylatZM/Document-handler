import { INotApprovedPossessions } from './../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPossession, IPossessionState, IComplex, IPosLoading } from '../../components/types';

const initialState: IPossessionState = {
  building: null,
  complex: null,
  possession: null,
  isLoading: null,
  notApprovedPossessions: null,
};

export const PossessionReducer = createSlice({
  name: 'PossessionReducer',
  initialState,
  reducers: {
    possessionStart: (state, { payload }: PayloadAction<IPosLoading>) => {
      state.isLoading = payload;
    },
    notApprovedPossessionSuccess: (
      state,
      { payload }: PayloadAction<INotApprovedPossessions[]>,
    ) => {
      state.notApprovedPossessions = payload;
      state.isLoading = null;
    },
    complexSuccess: (state, { payload }: PayloadAction<IComplex[]>) => {
      state.complex = payload;
      state.isLoading = null;
    },
    buildingSuccess: (state, { payload }: PayloadAction<IPossession[] | null>) => {
      state.building = payload;
      state.isLoading = null;
    },
    possessionSuccess: (state, { payload }: PayloadAction<IPossession[] | null>) => {
      state.possession = payload;
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
  notApprovedPossessionSuccess,
} = PossessionReducer.actions;

export default PossessionReducer.reducer;
