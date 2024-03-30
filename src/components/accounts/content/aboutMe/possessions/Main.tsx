import { Button } from 'antd';
import { Possessions } from './components/Possessions';
import { useActions } from '../../../../hooks/useActions';
import { FC, useEffect, useState } from 'react';
import { getCitizenRequest } from '../../../../../api/requests/Person';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

import { CreatePossession } from '../../createPossession/CreatePossession';
import { useLogout } from '../../../../hooks/useLogout';
import { LoadingSkeleton } from './LoadingSkeleton';

interface IProps {
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Main: FC<IProps> = ({ changeNeedShowNotification }) => {
  const logout = useLogout();
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { addCitizenForm, citizenSuccess } = useActions();
  const [needUpdateCitizen, changeNeedUpdate] = useState(true);
  const [needShowPossessionCreateForm, changeNeedShowPossessionCreateForm] = useState(false);
  const [updatingFormId, changeUpdatingFormId] = useState<number | null>(null);
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);

  useEffect(() => {
    if (needUpdateCitizen) getCitizenData();
  }, [needUpdateCitizen]);

  const getCitizenData = async () => {
    const response = await getCitizenRequest(logout);
    if (response) citizenSuccess(response);
    changeNeedUpdate(false);
  };

  if (needUpdateCitizen) return <LoadingSkeleton />;

  return (
    <>
      <CreatePossession
        needShowForm={needShowPossessionCreateForm}
        changeNeedShowForm={changeNeedShowPossessionCreateForm}
      />
      <span className='text-xl max-sm:mx-auto'>Собственность</span>
      <div className='flex max-sm:flex-col max-sm:gap-y-2 sm:flex-row sm:justify-between'>
        <Button
          className='bg-blue-700 text-white'
          type='primary'
          onClick={() => addCitizenForm()}
          disabled={user.account_status !== 'Подтвержден'}
        >
          Добавить собственность
        </Button>
        <Button
          className='border-blue-700 text-blue-700'
          onClick={() => changeNeedShowPossessionCreateForm(true)}
        >
          Не нашли собственность?
        </Button>
      </div>

      {citizens.map((el, index) => (
        <Possessions
          key={index}
          data={{
            key: !el.id ? -1 * citizens.length : el.id,
            info: el,
            isFirstItem: index === 0 ? true : false,
            isNew: el.id < 1 ? true : false,
          }}
          changeNeedUpdate={changeNeedUpdate}
          changeUpdatingFormId={changeUpdatingFormId}
          updatingFormId={updatingFormId}
          changeNeedShowNotification={changeNeedShowNotification}
        />
      ))}
    </>
  );
};
