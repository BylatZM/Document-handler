import { Button } from 'antd';
import { CitizenForm } from './CitizenForm';
import { useActions } from '../../../../hooks/useActions';
import { useEffect, useState } from 'react';
import { getCitizenRequest } from '../../../../../api/requests/Person';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Loading } from '../../../../Loading/Loading';
import { clsx } from 'clsx';
import { OwnershipCreateHandler } from '../OwnershipCreateHandler';
import { useLogout } from '../../../../hooks/useLogout';

export const AddCitizen = () => {
  const logout = useLogout();
  const role = useTypedSelector((state) => state.UserReducer.user.role.role);
  const { addCitizenForm, citizenSuccess } = useActions();
  const [needUpdateCitizen, changeNeedUpdate] = useState(true);

  const [IsCurtainHidden, changeCurtainHidden] = useState(true);
  const [IsFormHidden, changeIsFormHidden] = useState(true);
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);

  const changeFormVisibility = (status: boolean) => {
    setTimeout(() => changeIsFormHidden(status), 100);
    if (status) setTimeout(() => changeCurtainHidden(true), 1400);
    else changeCurtainHidden(false);
  };

  useEffect(() => {
    if (['citizen', 'dispatcher'].some((el) => el === role) && needUpdateCitizen) getCitizenData();
  }, [needUpdateCitizen]);

  const getCitizenData = async () => {
    const response = await getCitizenRequest(logout);
    if (response) citizenSuccess(response);
    changeNeedUpdate(false);
  };

  if (needUpdateCitizen) return <Loading />;

  return (
    <>
      <div
        className={clsx(
          'transitionOpacity',
          'fixed inset-0 bg-black bg-opacity-10 backdrop-blur-xl z-[20]',
          IsCurtainHidden && 'hidden',
          IsFormHidden ? 'opacity-0' : 'opacity-100',
        )}
      ></div>
      <OwnershipCreateHandler
        IsHidden={IsFormHidden}
        changeIsHidden={changeFormVisibility}
        IsCurtainActive={IsCurtainHidden}
      />
      <span className='text-xl'>Собственность</span>
      <div className='flex gap-4'>
        <Button
          className='bg-blue-700 text-white w-min'
          type='primary'
          onClick={() => addCitizenForm()}
        >
          Добавить собственность
        </Button>
        <Button type='link' onClick={() => changeFormVisibility(false)}>
          Не нашли свою собственность?
        </Button>
      </div>

      {citizens.map((el, index) => (
        <CitizenForm
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
