import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useTypedSelector } from './hooks/useTypedSelector';
import { useActions } from './hooks/useActions';

export const RequireAuth = () => {
  const { addAccess } = useActions();
  const { pathname } = useLocation();
  let access = useTypedSelector((state) => state.AuthReducer.access);
  if (!access && localStorage.getItem('access')) addAccess(localStorage.getItem('access'));

  return access && pathname.includes('/account') ? <Outlet /> : <Navigate to={'/'} />;
};
