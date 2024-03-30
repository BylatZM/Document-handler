import { useEffect, useState } from 'react';
import { INotApprovedPossessions } from '../../../../types';
import { AppTable } from './AppTable';
import { getNotApprovedPossessionsRequest } from '../../../../../api/requests/Possession';
import { useLogout } from '../../../../hooks/useLogout';

export const ApprovingLivingSpace = () => {
  const [tableInfo, changeTableInfo] = useState<INotApprovedPossessions[]>([]);
  const [isInfoLoading, changeIsInfoLoading] = useState<boolean>(false);
  const logout = useLogout();

  const makeGetNotApprovedPossessionsResponse = async () => {
    changeIsInfoLoading((prev) => true);
    const response = await getNotApprovedPossessionsRequest(logout);
    if (response) changeTableInfo(response);
    changeIsInfoLoading((prev) => false);
  };

  useEffect(() => {
    makeGetNotApprovedPossessionsResponse();
  }, []);

  return (
    <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-28 sm:mt-0'>
      <span className='text-gray-400 text-sm'>Найдено: {tableInfo.length}</span>
      <AppTable
        tableInfo={tableInfo}
        changeTableInfo={changeTableInfo}
        isInfoLoading={isInfoLoading}
      />
    </div>
  );
};
