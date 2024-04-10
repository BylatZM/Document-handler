import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Main } from './possessions/Main';
import { General } from './general/General';
import { FC, useEffect, useState } from 'react';
import { Notification } from './Notification';
import { useLogout } from '../../../hooks/useLogout';
import { getCitizenRequest, getUserRequest } from '../../../../api/requests/Person';
import { useActions } from '../../../hooks/useActions';
import { LoadingSkeleton } from './possessions/LoadingSkeleton';

interface IProps {
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AboutMe: FC<IProps> = ({ changeNeedShowCreatePossessionForm }) => {
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { error } = useTypedSelector((state) => state.CitizenReducer);
  const [showNotification, changeShowNotification] = useState(false);
  const [needUpdateAccountInfo, changeNeedUpdateAccountInfo] = useState(true);
  const { userSuccess, citizenSuccess, citizenErrors } = useActions();
  const logout = useLogout();

  const getAccountInfo = async () => {
    let response = null;
    if (['На подтверждении', 'Отклонен'].some((el) => el === user.account_status)) {
      response = await getUserRequest(logout);
      if (response) userSuccess(response);
    }
    if (error) citizenErrors(null);
    response = await getCitizenRequest(logout);
    if (response) citizenSuccess(response);
    changeNeedUpdateAccountInfo(false);
  };

  useEffect(() => {
    if (needUpdateAccountInfo && user.role === 'citizen') getAccountInfo();
  }, [needUpdateAccountInfo]);

  return (
    <>
      <Notification needShowForm={showNotification} changeNeedShowForm={changeShowNotification} />
      <div className='mt-[68px] max-sm:mt-[96px] fixed inset-0 overflow-auto'>
        <div className='w-[250px] mt-4 sm:w-[500px] flex flex-col gap-4 mx-auto p-2'>
          <General
            changeNeedShowNotification={changeShowNotification}
            changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
          />
          {user.role === 'citizen' && !needUpdateAccountInfo && (
            <Main
              changeNeedShowNotification={changeShowNotification}
              changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
              changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
            />
          )}
          {user.role === 'citizen' && needUpdateAccountInfo && <LoadingSkeleton />}
        </div>
      </div>
    </>
  );
};
