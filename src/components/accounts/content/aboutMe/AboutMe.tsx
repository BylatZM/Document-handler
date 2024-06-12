import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Main } from './possessions/Main';
import { General } from './general/General';
import { FC, useEffect, useRef, useState } from 'react';
import { Notification } from './Notification';
import { LoadingSkeleton } from './possessions/LoadingSkeleton';
import {
  IAboutMeGeneralSteps,
  IBuilding,
  ICitizenPossession,
  IError,
  IPossession,
} from '../../../types';

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
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const [showNotification, changeShowNotification] = useState(false);
  const [needUpdateAccountInfo, changeNeedUpdateAccountInfo] = useState(true);
  const [needMakeScroll, changeNeedMakeScroll] = useState(false);
  const [needMakeScrollForGeneral, changeNeedMakeScrollForGeneral] = useState(false);
  const [personalSteps, setPersonalSteps] = useState<IAboutMeGeneralSteps>({
    first_name: false,
    last_name: false,
    phone: false,
    general_button: false,
    edit_form_button: false,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (needUpdateAccountInfo && user.role === 'citizen') {
      getCitizenPossessions();
      changeNeedUpdateAccountInfo(false);
    }
  }, [needUpdateAccountInfo]);

  useEffect(() => {
    if (
      ref.current &&
      needMakeScroll &&
      !needUpdateAccountInfo &&
      localStorage.getItem('citizen_registered')
    ) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      changeNeedMakeScroll((prev) => !prev);
    }
  }, [needUpdateAccountInfo, needMakeScroll]);

  useEffect(() => {
    if (
      !needUpdateAccountInfo &&
      ref.current &&
      user.first_name &&
      user.last_name &&
      user.phone &&
      user.role === 'citizen' &&
      citizenPossessions.length === 1 &&
      citizenPossessions[0].created_date === '' &&
      localStorage.getItem('citizen_registered')
    ) {
      setPersonalSteps((prev) => ({ ...prev, general_button: true }));
      ref.current.scrollIntoView({ behavior: 'smooth' });
      changeNeedMakeScroll((prev) => !prev);
    }
  }, [needUpdateAccountInfo]);

  return (
    <>
      <Notification needShowForm={showNotification} changeNeedShowForm={changeShowNotification} />
      <div className='mt-[68px] max-sm:mt-[96px] fixed inset-0 overflow-auto'>
        <div className='w-[250px] mt-4 sm:w-[500px] flex flex-col gap-4 mx-auto p-2'>
          <General
            changeNeedMakeScroll={changeNeedMakeScroll}
            personalSteps={personalSteps}
            setPersonalSteps={setPersonalSteps}
            needMakeScrollForGeneral={needMakeScrollForGeneral}
            changeNeedMakeScrollForGeneral={changeNeedMakeScrollForGeneral}
          />
          {user.role === 'citizen' && !needUpdateAccountInfo && (
            <Main
              changeNeedShowNotification={changeShowNotification}
              changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
              changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
              getBuildings={getAllBuildingsByComplexId}
              getPossessions={getPossessions}
              generalPersonalSteps={personalSteps}
              setPersonalGeneralSteps={setPersonalSteps}
              changeNeedMakeScrollForGeneral={changeNeedMakeScrollForGeneral}
            />
          )}
          {user.role === 'citizen' && needUpdateAccountInfo && <LoadingSkeleton />}
        </div>
        <div className='opacity-0' ref={ref}></div>
      </div>
    </>
  );
};
