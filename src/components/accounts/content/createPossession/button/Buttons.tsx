import { HiOutlineCheck } from 'react-icons/hi';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { FC, useState } from 'react';
import { Button, ConfigProvider, Popover } from 'antd';
import { IApprovePossession, IError } from '../../../../types';
import { createPossessionRequest } from '../../../../../api/requests/Possession';

interface IProps {
  data: IApprovePossession;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
  error: IError | null;
  role: string;
  logout: () => void;
  exitFromForm: () => void;
}

export const Buttons: FC<IProps> = ({ data, changeError, error, role, logout, exitFromForm }) => {
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isRequestBad, changeIsRequestBad] = useState(false);
  const [isLoading, changeIsLoading] = useState(false);

  const makeRequest = async () => {
    changeIsLoading((prev) => !prev);
    if (error) changeError(null);
    const { complex, ...info } = data;
    const response = await createPossessionRequest(logout, info);
    changeIsLoading((prev) => !prev);
    if (response === 201) {
      changeIsRequestSuccess((prev) => !prev);
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
        exitFromForm();
      }, 2000);
    } else {
      if (response && 'type' in response) {
        changeError(response);
      }
      changeIsRequestBad((prev) => !prev);
      setTimeout(() => {
        changeIsRequestBad((prev) => !prev);
      }, 2000);
    }
  };

  return (
    <div className='mt-4 max-sm:mt-2 flex justify-center'>
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
              data.building && data.complex && data.name && !isLoading && !isRequestSuccess
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
            {isRequestBad && !isLoading && !isRequestSuccess && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!isLoading && !isRequestBad && isRequestSuccess && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {!isLoading && !isRequestBad && !isRequestSuccess && <>Создать</>}
          </Button>
        </ConfigProvider>
      </Popover>
    </div>
  );
};
