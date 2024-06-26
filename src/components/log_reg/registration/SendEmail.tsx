import { FC, useState, useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import clsx from 'clsx';
import { useActions } from '../../hooks/useActions';
import { updateUserPasswordRequest } from '../../../api/requests/User';

interface IProps {
  email: string;
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SendEmail: FC<IProps> = ({ email, needShowForm, changeNeedShowForm }) => {
  const [time, changeTime] = useState(30);
  const { regSuccess } = useActions();
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isLoading, changeIsLoading] = useState(false);

  const onFinish = async () => {
    changeIsLoading((prev) => !prev);
    const response = await updateUserPasswordRequest({ email: email, phone: '' });
    if (response === 201) {
      changeIsRequestSuccess((prev) => !prev);
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
        changeTime(30);
      }, 2000);
    }
    changeIsLoading((prev) => !prev);
  };

  useEffect(() => {
    if (time > 0 && needShowForm && email) {
      setTimeout(() => {
        changeTime((prev) => prev - 1);
      }, 1000);
    }
  }, [time, needShowForm]);

  return (
    <div
      className={clsx(
        'transitionGeneral fixed inset-0 flex justify-center items-center overflow-hidden bg-blue-500 bg-opacity-10 backdrop-blur-md z-[30]',
        needShowForm ? 'w-full h-full' : 'w-0 h-0',
      )}
    >
      <div
        className={clsx(
          'transitionGeneral border-blue-500 relative border-2 p-2 rounded-md flex max-sm:w-[250px] sm:w-[600px] max-md:h-[500px] h-[300px] flex-col justify-around bg-blue-700 bg-opacity-10 backdrop-blur-md z-[30]',
          email ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Button
          className='absolute right-4 top-4 border-blue-700 text-blue-700'
          onClick={() => {
            regSuccess({
              email: '',
            });
            changeNeedShowForm(false);
            changeTime(30);
          }}
          disabled={isLoading}
        >
          Закрыть
        </Button>
        <span className='my-auto text-center'>
          Ваш пароль и логин были высланы Вам на почту: <b>{email}</b>. Пожалуйста, проверьте Вашу
          почту
        </span>
        {time > 0 && (
          <span className='absolute bottom-4 inset-x-0 mx-auto text-center'>
            Отправить письмо повторно можно будет через: <b>{time}</b>
          </span>
        )}
        {time < 1 && (
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: undefined,
                },
              },
            }}
          >
            <Button
              className='absolute bottom-4 inset-x-0 mx-auto text-white w-min bg-blue-700'
              disabled={!isRequestSuccess && !isLoading ? false : true}
              type='primary'
              onClick={onFinish}
            >
              {isLoading && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
              {!isLoading && isRequestSuccess && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
              {!isLoading && !isRequestSuccess && <>Выслать повторно</>}
            </Button>
          </ConfigProvider>
        )}
      </div>
    </div>
  );
};
