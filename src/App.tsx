import { Routes, Route, useNavigate } from 'react-router-dom';
import { Main } from './components/log_reg/Main';
import { Account } from './components/accounts/Account';
import { RequireAuth } from './components/RequireAuth';
import { useEffect } from 'react';
import { ErrorPage } from './components/ErrorPage';

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('access')) navigate('/account/aboutMe');
  }, []);

  return (
    <div className='w-full'>
      <Routes>
        <Route path='/' element={<Main pageType='auth' />} />
        <Route path='/registration' element={<Main pageType='reg' />} />
        <Route element={<RequireAuth />}>
          <Route path='/account/*' element={<Account />} />
        </Route>
        <Route path='*' element={<ErrorPage message='Страница не найдена' />} />
      </Routes>
    </div>
  );
};
