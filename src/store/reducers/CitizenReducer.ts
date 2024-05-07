import { ICitizenError, ICitizenLoading } from '../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ICitizenState, ICitizenPossession } from '../../components/types';

export const defaultCitizen: ICitizenPossession = {
  id: 0,
  possession_type: '1',
  created_date: '',
  ownership_status: '2',
  complex: {
    id: 0,
    name: '',
  },
  building: {
    id: 0,
    address: '',
    complex: '',
  },
  possession: {
    id: 0,
    name: '',
    type: '',
    personal_account: null,
    building: '',
  },
  approving_status: 'На подтверждении',
};

const initialState: ICitizenState = {
  citizenPossessions: [defaultCitizen],
  isLoading: { form_id: 0, isLoading: false },
  error: null,
};

export const CitizenReducer = createSlice({
  name: 'CitizenReducer',
  initialState,
  reducers: {
    citizenLoading: (state, { payload }: PayloadAction<ICitizenLoading>) => {
      state.isLoading = payload;
    },
    citizenSuccess: (state, { payload }: PayloadAction<ICitizenPossession[]>) => {
      if (payload.length < 1) state.citizenPossessions = [defaultCitizen];
      else state.citizenPossessions = payload;
    },
    citizenErrors: (state, { payload }: PayloadAction<ICitizenError | null>) => {
      state.error = payload;
    },
    addCitizenForm: (state) => {
      state.citizenPossessions.push({
        ...defaultCitizen,
        id: -1 * state.citizenPossessions.length,
      });
    },
    updateCitizenForm: (
      state,
      { payload }: PayloadAction<{ form_id: number; citizen: ICitizenPossession }>,
    ) => {
      state.citizenPossessions = state.citizenPossessions.map((el) => {
        if (el.id === payload.form_id) return payload.citizen;
        else return el;
      });
    },
    deleteCitizenForm: (state, { payload }: PayloadAction<{ form_id: number }>) => {
      state.citizenPossessions = state.citizenPossessions.filter((el) => el.id !== payload.form_id);
    },
    citizenClear: (state): ICitizenState => {
      return initialState;
    },
  },
});

export const {
  citizenLoading,
  citizenSuccess,
  citizenErrors,
  addCitizenForm,
  updateCitizenForm,
  deleteCitizenForm,
  citizenClear,
} = CitizenReducer.actions;

export default CitizenReducer.reducer;
