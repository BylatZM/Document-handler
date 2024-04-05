import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Main } from './components/log_reg/Main';
import { Account } from './components/accounts/Account';
import { RequireAuth } from './components/RequireAuth';
import { useEffect } from 'react';
import { ErrorPage } from './components/ErrorPage';
import { ApprovingByLink } from './components/approvingByLink/ApprovingByLink';

export const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const cookie_array = document.cookie.split(';').filter((el) => el.includes('refresh'));
    const local_store = localStorage.getItem('access');
    if ((local_store || cookie_array.length) && !pathname.includes('/approveByLink'))
      navigate('/account/aboutMe');
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<Main pageType='auth' />} />
        <Route path='/registration' element={<Main pageType='reg' />} />
        <Route path='/approveByLink' element={<ApprovingByLink />} />
        <Route element={<RequireAuth />}>
          <Route path='/account/*' element={<Account />} />
        </Route>
        <Route path='*' element={<ErrorPage message='Страница не найдена' />} />
      </Routes>
    </>
  );
};
