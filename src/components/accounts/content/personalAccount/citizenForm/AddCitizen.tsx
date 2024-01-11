import { Button } from 'antd';
import { CitizenForm } from './CitizenForm';
import { useActions } from '../../../../hooks/useActions';
import { useEffect, useState } from 'react';
import { getCitizenRequest } from '../../../../../api/requests/Person';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

import { clsx } from 'clsx';
import { OwnershipCreateHandler } from '../OwnershipCreateHandler';
import { useLogout } from '../../../../hooks/useLogout';
import { LoadingForm } from './LoadingForm';

export const AddCitizen = () => {
  const logout = useLogout();
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { addCitizenForm, citizenSuccess } = useActions();
  const [needUpdateCitizen, changeNeedUpdate] = useState(false);
  const [isFormActive, changeIsFormActive] = useState(false);
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);

  useEffect(() => {
    if (['citizen', 'dispatcher'].some((el) => el === user.role.role) && needUpdateCitizen)
      getCitizenData();
  }, [needUpdateCitizen]);

  const getCitizenData = async () => {
    const response = await getCitizenRequest(logout);
    if (response) citizenSuccess(response);
    changeNeedUpdate(false);
  };

  if (needUpdateCitizen) return <LoadingForm />;

  return (
    <>
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          isFormActive ? 'w-full' : 'w-0',
        )}
      ></div>
      <OwnershipCreateHandler isFormActive={isFormActive} changeIsFormActive={changeIsFormActive} />
      <span className='text-xl'>Собственность</span>
      <div className='flex gap-4'>
        <Button
          className='bg-blue-700 text-white w-min'
          type='primary'
          onClick={() => addCitizenForm()}
          disabled={!user.isApproved}
        >
          Добавить собственность
        </Button>
        <Button type='link' onClick={() => changeIsFormActive(true)}>
          Не нашли свою собственность?
        </Button>
      </div>

      {citizens.map((el, index) => (
        <CitizenForm
          key={index}
          data={{
            key: !el.id ? -1 * citizens.length : el.id,
            info: el,
            isFirstItem: index === 0 ? true : false,
            isNew: el.id < 1 ? true : false,
          }}
          changeNeedUpdate={changeNeedUpdate}
        />
      ))}
    </>
  );
};
