import { DotsEffect } from '../../dotsAnimation/DotsEffect';
import { FC, useState, useEffect } from 'react';
import { Button } from 'antd';
import clsx from 'clsx';
import { RxCross1 } from 'react-icons/rx';
import { useActions } from '../../hooks/useActions';
import { updatePasswordRequest } from '../../../api/requests/Main';

interface IProps {
  email: string;
}

export const SendEmail: FC<IProps> = ({ email }) => {
  const [showCard, changeShow] = useState(false);
  const { regSuccess } = useActions();
  const [Time, changeTime] = useState(59);

  useEffect(() => {
    if (!showCard) changeShow(true);
  }, [showCard]);

  const onFinish = async () => {
    changeTime(59);
    await updatePasswordRequest({ email: email, phone: '' });
  };

  useEffect(() => {
    if (Time !== 0 && email !== '') {
      setTimeout(() => {
        changeTime((prev) => prev - 1);
      }, 1000);
    }
  }, [Time]);

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <DotsEffect dotsQuantity={10} />
      <div
        className={clsx(
          'border-blue-500 z-20 relative border-2 p-2 rounded-md flex w-[600px] h-[300px] flex-col justify-around bg-blue-700 bg-opacity-10 backdrop-blur-md',
          'transitionOpacity',
          showCard ? 'opacity-100' : 'opacity-0',
        )}
      >
        <RxCross1
          className='absolute right-4 top-4 transition-transform cursor-pointer hover:rotate-180'
          onClick={() => regSuccess({ email: '' })}
        />
        <span className='text-center'>
          Ваш пароль и логин были высланы вам на почту: <b>{email}</b>. Пожалуйста, проверьте вашу
          почту
        </span>
        {Time !== 0 && (
          <span className='mx-auto'>
            Отправка письма повторно будет доступна через: <span className='font-bold'>{Time}</span>
          </span>
        )}
        {Time === 0 && (
          <Button className='mx-auto bg-blue-500' type='primary' onClick={onFinish}>
            Выслать повторно
          </Button>
        )}
      </div>
    </div>
  );
};
