import { Navigate, Outlet } from 'react-router-dom';

import { useTypedSelector } from './hooks/useTypedSelector';
import { useActions } from './hooks/useActions';

export const RequireAuth = () => {
  const { addAccess } = useActions();
  let access = useTypedSelector((state) => state.AuthReducer.access);
  if (!access && localStorage.getItem('access')) addAccess(localStorage.getItem('access'));

  return access ? <Outlet /> : <Navigate to='/' />;
};
