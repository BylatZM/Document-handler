import { Popover } from 'antd';
import { GoQuestion } from 'react-icons/go';

export const Title = () => {
  return (
    <div className='text-center relative inset-0'>
      <span className='text-xl font-bold'>Обновление пароля</span>
      <Popover
        className=' animate-bounce'
        placement='left'
        content={
          <div className='max-w-[250px] sm:max-w-[400px]'>
            <span>
              Если Вы являетесь диспетчером или исполнителем укажите только адрес электронной почты
            </span>
            <br />
            <br />
            <span>
              Если Ваш аккаунт имеет хотя бы одну подтвержденную собственность, то, чтобы сбросить
              пароль, укажите почту, на который был зарегистрирован аккаунт, кликните на текст "Мой
              аккаунт имеет подтвержденную собственность", введите номер телефона, указанный в
              личном кабинете.
            </span>
            <br />
            <br />
            <span>
              Если Ваш аккаунт не имеет подтвержденных собственностей, укажите только адрес
              электронной почты, на который был зарегистрирован аккаунт.
            </span>
            <br />
            <br />
            <span>
              При успешном сбросе пароля на Вашу почту будет выслано письмо с логином и паролем для
              входа
            </span>
          </div>
        }
      >
        <GoQuestion className='absolute right-0 text-black inline text-lg top-10 sm:top-0 inset-y-0 my-auto' />
      </Popover>
    </div>
  );
};
