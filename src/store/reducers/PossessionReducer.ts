import { IBuilding, IError, IPossession } from './../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPossessionState, IComplex, IPosLoading } from '../../components/types';

const initialState: IPossessionState = {
  buildings: [],
  possessionTypes: [
    { id: 5, name: 'Жилищный комплекс' },
    { id: 1, name: 'Квартира' },
    { id: 2, name: 'Коммерческое помещение' },
    { id: 4, name: 'Кладовка' },
    { id: 3, name: 'Парковка' },
  ],
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
    buildingSuccess: (state, { payload }: PayloadAction<IBuilding[]>) => {
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
