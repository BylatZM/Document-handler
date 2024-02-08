import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RequireAuth = () => {
  const { pathname } = useLocation();

  return pathname.includes('/account') ? <Outlet /> : <Navigate to={'/'} />;
};
