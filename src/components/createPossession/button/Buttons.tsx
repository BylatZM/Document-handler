import { HiOutlineCheck } from 'react-icons/hi';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { FC, useState } from 'react';
import { Button, Popover } from 'antd';
import { IApprovePossession, IError } from '../../types';
import clsx from 'clsx';
import { useActions } from '../../hooks/useActions';
import { createPossessionRequest } from '../../../api/requests/Possession';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  error: IError | null;
  isLoading: boolean;
  defaultPossessionInfo: IApprovePossession;
  role: string;
  logout: () => void;
}

export const Buttons: FC<IProps> = ({
  data,
  changeData,
  changeError,
  changeIsFormActive,
  error,
  isLoading,
  defaultPossessionInfo,
  role,
  logout,
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
        changeData(defaultPossessionInfo);
        changeIsFormActive(false);
      }, 2000);
    } else {
      changeError({
        type: 'global',
        error: '',
      });
    }
  };

  return (
    <div className='mt-5 text-end'>
      <Button
        className='text-blue-700 border-blue-700 mr-4'
        disabled={isLoading}
        onClick={() => {
          changeData(defaultPossessionInfo);
          if (error) changeError(null);
          changeIsFormActive(false);
        }}
      >
        Закрыть
      </Button>
      <Popover content={role === 'citizen' ? 'Заявка будет рассмотрена диспетчером' : ''}>
        <Button
          type='primary'
          className={clsx(
            ' text-white',
            !error && !isRequestSuccess && 'bg-blue-700',
            error && !isRequestSuccess && !isLoading && 'bg-red-500',
            !error && isRequestSuccess && !isLoading && 'bg-green-500',
          )}
          disabled={
            data.building &&
            data.complex &&
            data.possession.address &&
            ((data.type === 3 &&
              data.possession.car &&
              data.possession.car.car_brand &&
              data.possession.car.state_number) ||
              data.type !== 3)
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
      </Popover>
    </div>
  );
};
