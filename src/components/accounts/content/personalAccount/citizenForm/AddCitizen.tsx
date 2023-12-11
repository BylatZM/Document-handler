import { Button } from 'antd';
import { CitizenForm } from './CitizenForm';
import { useActions } from '../../../../hooks/useActions';
import { useEffect, useState } from 'react';
import { getCitizenRequest } from '../../../../../store/creators/PersonCreators';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

export const AddCitizen = () => {
  const role = useTypedSelector((state) => state.UserReducer.user.role.role);
  const { addCitizenForm, citizenSuccess } = useActions();
  const [needUpdateCitizen, changeNeedUpdate] = useState(false);
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);

  useEffect(() => {
    if (['житель', 'диспетчер'].some((el) => el === role) && needUpdateCitizen) getCitizenData();
  }, [needUpdateCitizen]);

  const getCitizenData = async () => {
    const response = await getCitizenRequest();
    if (response !== 403) citizenSuccess(response);
  };

  return (
    <>
      <span className='text-xl'>Информация роли "житель"</span>
      <div className='flex gap-4'>
        <Button
          className='bg-blue-700 text-white w-min'
          type='primary'
          onClick={() => addCitizenForm()}
        >
          Добавить собственность
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
