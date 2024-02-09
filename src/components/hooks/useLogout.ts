import { useActions } from './useActions';
import { useNavigate } from 'react-router-dom';

export const useLogout = (): (() => void) => {
  const {
    possessionClear,
    userClear,
    helpFormClear,
    regClear,
    authClear,
    citizenClear,
    applicationClear,
  } = useActions();
  const navigate = useNavigate();

  const logout = () => {
    possessionClear();
    userClear();
    helpFormClear();
    regClear();
    authClear();
    citizenClear();
    applicationClear();
    localStorage.removeItem('access');
    document.cookie = `refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${
      process.env.NODE_ENV === 'development' ? 'localhost' : 'uslugi.dltex.ru'
    };`;
    navigate('/');
  };

  return logout;
};
