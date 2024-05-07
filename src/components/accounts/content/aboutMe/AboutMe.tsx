import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Main } from './possessions/Main';
import { General } from './general/General';
import { FC, useEffect, useState } from 'react';
import { Notification } from './Notification';
import { LoadingSkeleton } from './possessions/LoadingSkeleton';
import { IBuilding, ICitizenPossession, IError, IPossession } from '../../../types';

interface IProps {
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  getCitizenPossessions: () => Promise<ICitizenPossession[] | void>;
}

export const AboutMe: FC<IProps> = ({
  changeNeedShowCreatePossessionForm,
  getPossessions,
  getAllBuildingsByComplexId,
  getCitizenPossessions,
}) => {
  const { user } = useTypedSelector((state) => state.UserReducer);
  const [showNotification, changeShowNotification] = useState(false);
  const [needUpdateAccountInfo, changeNeedUpdateAccountInfo] = useState(true);

  useEffect(() => {
    if (needUpdateAccountInfo && user.role === 'citizen') {
      getCitizenPossessions();
      changeNeedUpdateAccountInfo(false);
    }
  }, [needUpdateAccountInfo]);

  return (
    <>
      <Notification needShowForm={showNotification} changeNeedShowForm={changeShowNotification} />
      <div className='mt-[68px] max-sm:mt-[96px] fixed inset-0 overflow-auto'>
        <div className='w-[250px] mt-4 sm:w-[500px] flex flex-col gap-4 mx-auto p-2'>
          <General />
          {user.role === 'citizen' && !needUpdateAccountInfo && (
            <Main
              changeNeedShowNotification={changeShowNotification}
              changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
              changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
              getBuildings={getAllBuildingsByComplexId}
              getPossessions={getPossessions}
            />
          )}
          {user.role === 'citizen' && needUpdateAccountInfo && <LoadingSkeleton />}
        </div>
      </div>
    </>
  );
};
