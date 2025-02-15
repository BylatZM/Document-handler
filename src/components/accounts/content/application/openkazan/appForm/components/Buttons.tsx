import { FC, useState } from 'react';
import {
  IStatus,
  IUpdateGisAppByDispatcher,
  IUpdateGisAppByEmployee,
  IOpenKazanApplication,
} from '../../../../../../types';
import { Button, ConfigProvider } from 'antd';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

type IOperation =
  | 'update'
  | 'close_application'
  | 'proceed_to_execution'
  | 'return_for_revision'
  | 'got_incorrectly';

type IUpdateOperation = 'update' | 'close_application' | 'proceed_to_execution';

interface IProps {
  data: IOpenKazanApplication;
  role: string;
  exitFromForm: () => void;
  logout: () => void;
}

const makeFakeRequest = async () => await new Promise((resolve, _) => setTimeout(() => resolve(200), 2000))

export const Buttons: FC<IProps> = ({ data, role, exitFromForm, logout }) => {
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<null | IOperation>(null);
  const [successButton, changeSuccessButton] = useState<null | IOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<null | IOperation>(null);

  const makeUpdateOpenKazanApplication = async (operation_type: IUpdateOperation) => {
    if (operation_type === 'update') changeLoadingButton('update');
    if (operation_type === 'close_application') changeLoadingButton('close_application');
    if (operation_type === 'proceed_to_execution') changeLoadingButton('proceed_to_execution');
    let info: IUpdateGisAppByDispatcher | IUpdateGisAppByEmployee = {
      status: statuses[0].id,
    };
    let new_status: IStatus[] | null = null;
    if (operation_type === 'update') {
      if (role === 'dispatcher') {
        new_status = statuses.filter((el) => el.name === 'Назначена');
        if (!new_status.length) return;
        info = {
          ...info,
          status: data.status.name === 'Новая' ? new_status[0].id : data.status.id,
        };
      }
    }
    if (
      ['Назначена'].some((el) => el === data.status.name) &&
      operation_type === 'proceed_to_execution'
    ) {
      new_status = statuses.filter((el) => el.name === 'В работе');
      if (!new_status.length) return;
      info = {
        status: new_status[0].id,
      };
    }
    if (
      ['В работе', 'Назначена'].some((el) => el === data.status.name) &&
      operation_type === 'close_application'
    ) {
      new_status = statuses.filter((el) => el.name === 'Закрыта');
      if (!new_status.length) return;
      if (role === 'dispatcher') {
        info = {
          ...info,
          status: new_status[0].id,
        };
      }
    }
    if (!new_status || (new_status && new_status.length !== 1)) {
      new_status = [{ ...data.status }];
    }

    if (errorButton) changeErrorButton(null);

    const response = await makeFakeRequest()
    changeLoadingButton(null);
    if (response === 200) {
      if (operation_type === 'update') changeSuccessButton('update');
      if (operation_type === 'close_application') changeSuccessButton('close_application');
      if (operation_type === 'proceed_to_execution') changeSuccessButton('proceed_to_execution');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        exitFromForm();
      }, 2000);
    }
  };

  return (
    <div className='gap-4 flex flex-wrap justify-center'>
      {data.status.name !== 'Закрыта' &&
        (role === 'dispatcher' || (role === 'executor' && data.status.name !== 'Назначена')) && (
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
              onClick={() => {
                makeUpdateOpenKazanApplication('update');
              }}
              className='text-white bg-blue-700'
              disabled={
                !loadingButton &&
                !successButton
                  ? false
                  : true
              }
            >
              {loadingButton === 'update' && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
              {errorButton === 'update' && !loadingButton && !successButton && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
                </div>
              )}
              {!loadingButton && !errorButton && successButton === 'update' && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
              {loadingButton !== 'update' &&
                errorButton !== 'update' &&
                successButton !== 'update' && <>Записать</>}
            </Button>
          </ConfigProvider>
        )}
      {(
        (data.status.name === 'Назначена' && role === 'dispatcher')) && (
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
            onClick={() => {
              makeUpdateOpenKazanApplication('close_application');
            }}
            className='text-white bg-green-700'
            disabled={!loadingButton && !successButton ? false : true}
          >
            {loadingButton === 'close_application' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'close_application' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'close_application' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'close_application' &&
              errorButton !== 'close_application' &&
              successButton !== 'close_application' && <>Заявка выполнена</>}
          </Button>
        </ConfigProvider>
      )}
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimaryHover: '#1d4ed8',
            },
          },
        }}
      >
        <Button
          className='transition-colors border-white text-white'
          disabled={loadingButton ? true : false}
          onClick={() => {
            exitFromForm();
            if (errorButton) changeErrorButton(null);
          }}
        >
          Закрыть
        </Button>
      </ConfigProvider>
    </div>
  );
};
