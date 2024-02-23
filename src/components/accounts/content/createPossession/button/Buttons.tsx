import { HiOutlineCheck } from 'react-icons/hi';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { FC, useState } from 'react';
import { Button, ConfigProvider, Popover } from 'antd';
import { IApprovePossession, IError } from '../../../../types';
import clsx from 'clsx';
import { useActions } from '../../../../hooks/useActions';
import { createPossessionRequest } from '../../../../../api/requests/Possession';

interface IProps {
  data: IApprovePossession;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
  error: IError | null;
  isLoading: boolean;
  role: string;
  logout: () => void;
  exitFromForm: () => void;
}

export const Buttons: FC<IProps> = ({
  data,
  changeError,
  error,
  isLoading,
  role,
  logout,
  exitFromForm,
}) => {
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const { userLoading } = useActions();

  const makeRequest = async () => {
    userLoading(true);
    if (error) changeError(null);
    const { complex, ...info } = data;
    const response = await createPossessionRequest(logout, info);
    userLoading(false);
    if (response && typeof response !== 'number' && 'type' in response) {
      changeError(response);
      return;
    }
    if (response === 201) {
      changeIsRequestSuccess((prev) => !prev);
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
        exitFromForm();
      }, 2000);
    } else {
      changeError({
        type: 'global',
        error: '',
      });
    }
  };

  return (
    <div className='mt-5 flex justify-center'>
      <Button
        className='text-blue-700 border-blue-700 mr-4'
        disabled={isLoading}
        onClick={() => {
          exitFromForm();
        }}
      >
        Закрыть
      </Button>
      <Popover content={role === 'citizen' ? 'Заявка будет рассмотрена диспетчером' : ''}>
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
            type='primary'
            className='text-white bg-blue-700'
            disabled={
              data.building && data.complex && data.possession && !isLoading && !isRequestSuccess
                ? false
                : true
            }
            onClick={() => {
              makeRequest();
            }}
          >
            {isLoading && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {error && !isLoading && !isRequestSuccess && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!isLoading && !error && isRequestSuccess && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {!isLoading && !error && !isRequestSuccess && <>Создать</>}
          </Button>
        </ConfigProvider>
      </Popover>
    </div>
  );
};
