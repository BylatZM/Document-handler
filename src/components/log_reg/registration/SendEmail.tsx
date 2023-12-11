import { DotsEffect } from '../../dotsAnimation/DotsEffect';
import { FC, useState, useEffect } from 'react';
import { Button } from 'antd';
import clsx from 'clsx';
import { RxCross1 } from 'react-icons/rx';
import { useActions } from '../../hooks/useActions';

interface IProps {
  email: string;
}

export const SendEmail: FC<IProps> = ({ email }) => {
  const [showCard, changeShow] = useState(false);
  const { regSuccess } = useActions();

  useEffect(() => {
    if (!showCard) changeShow(true);
  }, [showCard]);

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
        <Button className='mx-auto bg-blue-500' type='primary'>
          Выслать повторно
        </Button>
      </div>
    </div>
  );
};
