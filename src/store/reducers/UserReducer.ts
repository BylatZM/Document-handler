import { IError } from '../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IUserState, IUser } from '../../components/types';

const initialState: IUserState = {
  user: {
    first_name: '',
    role: { role: '' },
    last_name: '',
    patronymic: null,
    phone: null,
    email: '',
    isApproved: false,
  },
  isLoading: false,
  error: null,
};

export const UserReducer = createSlice({
  name: 'UserReducer',
  initialState,
  reducers: {
    userStart: (state) => {
      state.isLoading = true;
    },
    userSuccess: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.isLoading = false;
    },
    error: (state, { payload }: PayloadAction<IError | null>) => {
      state.isLoading = false;
      state.error = payload;
    },
    userClear: (state): IUserState => {
      return initialState;
    },
  },
});

export const { userStart, userSuccess, error, userClear } = UserReducer.actions;

export default UserReducer.reducer;
