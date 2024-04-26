import { useEffect, useState } from 'react';
import { INotApprovedCitizenPossession } from '../../../../types';
import { AppTable } from './components/AppTable';
import { getNotApprovedCitizenPossessionsRequest } from '../../../../../api/requests/User';
import { useLogout } from '../../../../hooks/useLogout';
import { Main } from './components/Main';

export const ApprovingUserPossession = () => {
  const [notApprovedCitizenPossessions, changeNotApprovedCitizenPossessions] = useState<
    INotApprovedCitizenPossession[]
  >([]);
  const [isLoading, changeIsLoading] = useState<boolean>(false);
  const [selectedCitizenPossession, changeSelectedCitizenPossession] =
    useState<INotApprovedCitizenPossession | null>(null);
  const logout = useLogout();

  const makeGetNotApprovedRequest = async () => {
    changeIsLoading(true);
    const response = await getNotApprovedCitizenPossessionsRequest(logout);
    if (response) changeNotApprovedCitizenPossessions(response);
    changeIsLoading(false);
  };

  useEffect(() => {
    makeGetNotApprovedRequest();
  }, []);

  return (
    <>
      <Main
        selectedCitizenPossession={selectedCitizenPossession}
        changeSelectedCitizenPossession={changeSelectedCitizenPossession}
      />
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-[22px] sm:mt-0'>
          <span className='text-gray-400 text-sm'>
            Найдено: {notApprovedCitizenPossessions.length}
          </span>
          <AppTable
            tableInfo={notApprovedCitizenPossessions}
            changeTableInfo={changeNotApprovedCitizenPossessions}
            isLoading={isLoading}
            changeSelectedCitizenPossession={changeSelectedCitizenPossession}
          />
        </div>
      </div>
    </>
  );
};
