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
      <div className='relative min-w-[250px] max-w-[250px] sm:min-w-[500px] sm:max-w-[500px] aspect-square border-blue-500 border-2 max-sm:p-1 sm:p-5 rounded-md flex items-end bg-blue-700 bg-opacity-10 backdrop-blur-md'>
        <div className='absolute w-fit h-fit text-center inset-0 m-auto'>
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
