import { IError } from '../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IUserState, IUser } from '../../components/types';

const initialState: IUserState = {
  user: {
    id: 0,
    first_name: '',
    role: '',
    last_name: '',
    patronymic: null,
    phone: null,
    email: '',
    is_approved: false,
  },
  isLoading: false,
  error: null,
};

export const UserReducer = createSlice({
  name: 'UserReducer',
  initialState,
  reducers: {
    userLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    userSuccess: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.isLoading = false;
    },
    userError: (state, { payload }: PayloadAction<IError | null>) => {
      state.error = payload;
    },
    userClear: (state): IUserState => {
      return initialState;
    },
  },
});

export const { userLoading, userSuccess, userError, userClear } = UserReducer.actions;

export default UserReducer.reducer;
