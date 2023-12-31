import { IError, INotApprovedUsers } from '../../components/types';
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
  notApprovedUsers: null,
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
    notApprovedUsersSuccess: (state, { payload }: PayloadAction<INotApprovedUsers[]>) => {
      state.notApprovedUsers = payload;
      state.isLoading = false;
    },
    deleteNotApprovedUsers: (state, { payload }: PayloadAction<number>) => {
      if (state.notApprovedUsers) {
        state.notApprovedUsers = state.notApprovedUsers.filter((el) => el.id !== payload);
      }
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

export const {
  userStart,
  userSuccess,
  error,
  userClear,
  notApprovedUsersSuccess,
  deleteNotApprovedUsers,
} = UserReducer.actions;

export default UserReducer.reducer;
