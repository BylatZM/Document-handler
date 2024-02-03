import { Popover } from 'antd';
import { GoQuestion } from 'react-icons/go';

export const Title = () => {
  return (
    <div className='text-center relative inset-0'>
      <span className='text-xl font-bold'>Обновление пароля</span>
      <Popover
        content={
          <div className='max-w-[400px]'>
            <span>
              Если ваш аккаунт подтвержен диспетером (то есть вы можете создавать заявки) укажите
              почту и номер телефона, заданные в аккаунте, чтобы обновить пароль.
            </span>
            <br></br>
            <br></br>
            <span>
              Если ваш аккаунт не подтвержен диспетером (то есть вы не можете создавать заявки)
              укажите только почту, заданную в аккаунте, чтобы обновить пароль.
            </span>
            <br></br>
            <br></br>
            <span>Аккаунты всех диспетчеров и исполнителей подтверждены по умолчанию</span>
          </div>
        }
      >
        <GoQuestion className='absolute right-0 text-gray-400 inline text-lg inset-y-0 my-auto' />
      </Popover>
    </div>
  );
};
