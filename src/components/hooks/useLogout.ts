import { useActions } from './useActions';

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

  const logout = () => {
    possessionClear();
    userClear();
    helpFormClear();
    regClear();
    authClear();
    citizenClear();
    applicationClear();
    localStorage.removeItem('access');
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };

  return logout;
};
