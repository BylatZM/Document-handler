import { DotsEffect } from '../../dotsAnimation/DotsEffect';
import { FC, useState, useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import { ImSpinner9, ImCross } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import clsx from 'clsx';
import { useActions } from '../../hooks/useActions';
import { updatePasswordRequest } from '../../../api/requests/Main';

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
  const [isError, changeIsError] = useState(false);

  const onFinish = async () => {
    changeIsLoading((prev) => !prev);
    const response = await updatePasswordRequest({ email: email, phone: '' });
    if (response === 201) {
      changeIsRequestSuccess((prev) => !prev);
      setTimeout(() => {
        if (isError) changeIsError((prev) => !prev);
        changeIsRequestSuccess((prev) => !prev);
        changeTime(30);
      }, 2000);
    } else changeIsError((prev) => !prev);
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
          'transitionGeneral border-blue-500 relative border-2 p-2 rounded-md flex w-[600px] h-[300px] flex-col justify-around bg-blue-700 bg-opacity-10 backdrop-blur-md z-[30]',
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
          Ваш пароль и логин были высланы вам на почту: <b>{email}</b>. Пожалуйста, проверьте вашу
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
              className={clsx(
                'absolute bottom-4 inset-x-0 mx-auto text-white w-min',
                !isError && !isRequestSuccess && 'bg-blue-700',
                isError && !isRequestSuccess && !isLoading && 'bg-red-500',
                !isError && isRequestSuccess && !isLoading && 'bg-green-500',
              )}
              type='primary'
              onClick={onFinish}
            >
              {isLoading && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
              {isError && !isLoading && !isRequestSuccess && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
                </div>
              )}
              {!isLoading && !isError && isRequestSuccess && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
              {!isLoading && !isError && !isRequestSuccess && <>Выслать повторно</>}
            </Button>
          </ConfigProvider>
        )}
      </div>
    </div>
  );
};
