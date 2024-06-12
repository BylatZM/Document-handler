import { FC, useState } from 'react';
import {
  IStatus,
  IGisApplication,
  IUpdateGisAppByDispatcher,
  IUpdateGisAppByEmployee,
} from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';
import { Button, ConfigProvider } from 'antd';
import { updateGisApplicationByIdRequest } from '../../../../../../../api/requests/Application';
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
  data: IGisApplication;
  role: string;
  exitFromForm: () => void;
  logout: () => void;
  getApplications: () => Promise<void>;
}

export const Buttons: FC<IProps> = ({ data, role, exitFromForm, logout, getApplications }) => {
  const { applicationError } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<null | IOperation>(null);
  const [successButton, changeSuccessButton] = useState<null | IOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<null | IOperation>(null);

  const makeUpdateGisApplication = async (operation_type: IUpdateOperation) => {
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
        if (!data.type || !data.subtype || !data.employee || !data.complex || !new_status.length)
          return;
        info = {
          ...info,
          status: data.status.name === 'Новая' ? new_status[0].id : data.status.id,
          type: data.type.id,
          subtype: data.subtype.id,
          priority: data.priority.id,
          employee: data.employee.id,
          complex: data.complex.id,
          dispatcher_comment: data.dispatcher_comment,
        };
      }
      if (role === 'executor') {
        info = {
          ...info,
          status: data.status.id,
          employee_comment: data.employee_comment,
        };
      }
    }
    if (
      ['Назначена', 'Возвращена'].some((el) => el === data.status.name) &&
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
      if (role === 'executor') {
        info = { ...info, status: new_status[0].id, employee_comment: data.employee_comment };
      }
      if (role === 'dispatcher') {
        if (!data.type || !data.subtype || !data.employee || !data.complex || !new_status.length)
          return;
        info = {
          ...info,
          status: new_status[0].id,
          type: data.type.id,
          subtype: data.subtype.id,
          priority: data.priority.id,
          employee: data.employee.id,
          complex: data.complex.id,
          dispatcher_comment: data.dispatcher_comment,
        };
      }
    }
    if (!new_status || (new_status && new_status.length !== 1)) {
      new_status = [{ ...data.status }];
    }

    if (errorButton) changeErrorButton(null);

    const response = await updateGisApplicationByIdRequest(data.id.toString(), logout, info);
    changeLoadingButton(null);
    if (response === 200) {
      if (operation_type === 'update') changeSuccessButton('update');
      if (operation_type === 'close_application') changeSuccessButton('close_application');
      if (operation_type === 'proceed_to_execution') changeSuccessButton('proceed_to_execution');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        getApplications();
        exitFromForm();
      }, 2000);
    } else {
      if (response && 'type' in response) applicationError(response);
      if (operation_type === 'update') changeErrorButton('update');
      if (operation_type === 'close_application') changeErrorButton('close_application');
      if (operation_type === 'proceed_to_execution') changeErrorButton('proceed_to_execution');
      setTimeout(() => changeErrorButton(null), 2000);
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
                makeUpdateGisApplication('update');
              }}
              className='text-white bg-blue-700'
              disabled={
                !loadingButton &&
                !successButton &&
                ((role === 'dispatcher' &&
                  ((data.dispatcher_comment && data.dispatcher_comment.length < 501) ||
                    !data.dispatcher_comment) &&
                  data.priority.id &&
                  data.employee &&
                  data.type &&
                  data.subtype) ||
                  (role === 'executor' &&
                    data.employee_comment &&
                    data.employee_comment.length < 501))
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
      {((role === 'executor' && data.status.name === 'В работе') ||
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
              makeUpdateGisApplication('close_application');
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
      {role === 'executor' && data.status.name === 'Назначена' && (
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
              makeUpdateGisApplication('proceed_to_execution');
            }}
            className='text-white bg-amber-500'
            disabled={!loadingButton && !successButton ? false : true}
          >
            {loadingButton === 'proceed_to_execution' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'proceed_to_execution' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'proceed_to_execution' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'proceed_to_execution' &&
              errorButton !== 'proceed_to_execution' &&
              successButton !== 'proceed_to_execution' && <>Приступить к исполнению</>}
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
