import { Button } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Notification: FC<IProps> = ({ needShowForm, changeNeedShowForm }) => {
  return (
    <div
      className={clsx(
        'transitionGeneral fixed left-0 bottom-0 bg-opacity-10 backdrop-blur-md bg-blue-500 overflow-hidden z-30 flex items-center justify-center',
        needShowForm ? 'w-full h-full' : 'w-0 h-0',
      )}
    >
      <div className='min-w-[400px] max-w-[400px] aspect-square border-blue-500 border-2 p-5 rounded-md flex flex-col justify-between bg-blue-700 bg-opacity-10 backdrop-blur-md'>
        <div className='text-center mt-20'>
          Ваши данные были сохранены. Ожидайте подтверждения аккаунта от диспетчера. Уведомление о
          подтверждении аккаунта придет на вашу почту
        </div>
        <div className='flex w-full justify-center'>
          <Button
            className=' border-blue-700 text-blue-700'
            onClick={() => changeNeedShowForm(false)}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
