import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Main } from './possessions/Main';
import { General } from './general/General';
import { useState } from 'react';
import { Notification } from './Notification';

export const AboutMe = () => {
  const { user } = useTypedSelector((state) => state.UserReducer);
  const [showNotification, changeShowNotification] = useState(false);

  return (
    <>
      <Notification needShowForm={showNotification} changeNeedShowForm={changeShowNotification} />
      <div className='w-[500px] flex flex-col gap-4 m-auto p-2'>
        <General changeNeedShowNotification={changeShowNotification} />
        {user.role === 'citizen' && <Main changeNeedShowNotification={changeShowNotification} />}
      </div>
    </>
  );
};
