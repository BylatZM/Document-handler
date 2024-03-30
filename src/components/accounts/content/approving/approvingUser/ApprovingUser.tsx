import { useEffect, useState } from 'react';
import { User } from './components/User';
import { INotApprovedUsers, IUser, IUserDetailsInfo } from '../../../../types';
import { AppTable } from './components/AppTable';
import { getNotApprovedUsersRequest } from '../../../../../api/requests/Person';
import { useLogout } from '../../../../hooks/useLogout';

export const ApprovingUser = () => {
  const [isFormActive, changeIsFormActive] = useState(false);
  const logout = useLogout();
  const [selectedUserInfo, changeUserInfo] = useState<IUserDetailsInfo | null>(null);
  const [tableInfo, changeTableInfo] = useState<INotApprovedUsers[]>([]);
  const [isTableLoading, changeIsTableLoading] = useState<boolean>(false);

  const getNotApprovedUsers = async () => {
    changeIsTableLoading((prev) => !prev);
    const response = await getNotApprovedUsersRequest(logout);
    if (response) changeTableInfo(response);
    changeIsTableLoading((prev) => !prev);
  };

  useEffect(() => {
    getNotApprovedUsers();
  }, []);

  return (
    <>
      <User
        changeIsFormActive={changeIsFormActive}
        isFormActive={isFormActive}
        selectedUserInfo={selectedUserInfo}
        changeUserInfo={changeUserInfo}
      />
      <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-32 sm:mt-0'>
        <span className='text-gray-400 text-sm'>Найдено: {tableInfo.length}</span>
        <AppTable
          tableInfo={tableInfo}
          changeTableInfo={changeTableInfo}
          changeIsFormActive={changeIsFormActive}
          changeUserInfo={changeUserInfo}
          isTableLoading={isTableLoading}
        />
      </div>
    </>
  );
};
