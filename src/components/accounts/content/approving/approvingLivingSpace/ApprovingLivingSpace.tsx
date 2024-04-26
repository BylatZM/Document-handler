import { useEffect, useState } from 'react';
import { INotApprovedPossession } from '../../../../types';
import { AppTable } from './components/AppTable';
import { getAllNotApprovedPossessionsRequest } from '../../../../../api/requests/Possession';
import { useLogout } from '../../../../hooks/useLogout';
import { Main } from './components/Main';

export const ApprovingLivingSpace = () => {
  const [tableInfo, changeTableInfo] = useState<INotApprovedPossession[]>([]);
  const [isInfoLoading, changeIsInfoLoading] = useState<boolean>(false);
  const logout = useLogout();
  const [selectedPossession, changeSelectedPossession] = useState<INotApprovedPossession | null>(
    null,
  );

  const makeGetNotApprovedPossessionsResponse = async () => {
    changeIsInfoLoading((prev) => true);
    const response = await getAllNotApprovedPossessionsRequest(logout);
    if (response) changeTableInfo(response);
    changeIsInfoLoading((prev) => false);
  };

  useEffect(() => {
    makeGetNotApprovedPossessionsResponse();
  }, []);

  return (
    <>
      <Main
        selectedPossession={selectedPossession}
        changeSelectedPossession={changeSelectedPossession}
      />
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-[22px]'>
          <span className='text-gray-400 text-sm'>Найдено: {tableInfo.length}</span>
          <AppTable
            tableInfo={tableInfo}
            changeTableInfo={changeTableInfo}
            isInfoLoading={isInfoLoading}
            changeSelectedPossession={changeSelectedPossession}
          />
        </div>
      </div>
    </>
  );
};
