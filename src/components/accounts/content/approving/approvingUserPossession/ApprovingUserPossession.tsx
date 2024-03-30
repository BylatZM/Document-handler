import { useEffect, useState } from 'react';
import { INotApprovedCitizens } from '../../../../types';
import { AppTable } from './AppTable';
import { getNotApprovedCitizensRequest } from '../../../../../api/requests/Person';
import { useLogout } from '../../../../hooks/useLogout';

export const ApprovingUserPossession = () => {
  const [notApprovedCitizens, changeNotApprovedCitizens] = useState<INotApprovedCitizens[]>([]);
  const [isInfoLoading, changeIsInfoLoading] = useState<boolean>(false);
  const logout = useLogout();

  const makeGetNotApprovedRequest = async () => {
    changeIsInfoLoading(true);
    const response = await getNotApprovedCitizensRequest(logout);
    if (response) changeNotApprovedCitizens(response);
    changeIsInfoLoading(false);
  };

  useEffect(() => {
    makeGetNotApprovedRequest();
  }, []);

  return (
    <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-28 sm:mt-0'>
      <span className='text-gray-400 text-sm'>Найдено: {notApprovedCitizens.length}</span>
      <AppTable
        tableInfo={notApprovedCitizens}
        changeTableInfo={changeNotApprovedCitizens}
        isInfoLoading={isInfoLoading}
      />
    </div>
  );
};
