import { ICitizenError } from '../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ICitizenState, ICitizen } from '../../components/types';

const defaultCitizen: ICitizen = {
  id: 0,
  personal_account: '',
  ownershipType: '1',
  ownershipStatus: '1',
  complex: {
    id: 0,
    name: '',
  },
  building: {
    id: 0,
    address: '',
  },
  possession: {
    id: 0,
    address: '',
    car: null,
  },
};

const initialState: ICitizenState = {
  citizen: [defaultCitizen],
  isLoading: null,
  error: null,
};

export const CitizenReducer = createSlice({
  name: 'CitizenReducer',
  initialState,
  reducers: {
    citizenStart: (state, { payload }: PayloadAction<{ form_id: number }>) => {
      state.isLoading = { form_id: payload.form_id, isLoading: true };
    },
    citizenSuccess: (state, { payload }: PayloadAction<ICitizen[]>) => {
      if (payload.length < 1) state.citizen = [defaultCitizen];
      else state.citizen = payload;
      state.isLoading = null;
    },
    citizenErrors: (state, { payload }: PayloadAction<ICitizenError | null>) => {
      state.isLoading = null;
      state.error = payload;
    },
    addCitizenForm: (state) => {
      state.citizen.push({ ...defaultCitizen, id: -1 * state.citizen.length });
    },
    updateCitizenForm: (
      state,
      { payload }: PayloadAction<{ form_id: number; citizen: ICitizen }>,
    ) => {
      state.isLoading = null;
      state.citizen.filter((el) => el.id === payload.form_id)[0] = payload.citizen;
    },
    deleteCitizenForm: (state, { payload }: PayloadAction<{ form_id: number }>) => {
      state.citizen = state.citizen.filter((el) => el.id !== payload.form_id);
    },
    citizenClear: (state): ICitizenState => {
      return initialState;
    },
  },
});

export const {
  citizenStart,
  citizenSuccess,
  citizenErrors,
  addCitizenForm,
  updateCitizenForm,
  deleteCitizenForm,
  citizenClear,
} = CitizenReducer.actions;

export default CitizenReducer.reducer;
