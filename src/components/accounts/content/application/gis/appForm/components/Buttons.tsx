import { FC, useState } from 'react';
import {
  IRole,
  IStatus,
  IGisApplication,
  IUpdateGisAppByDispatcher,
  IUpdateGisAppByEmployee,
} from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';
import { Button, ConfigProvider } from 'antd';
import { updateGisAppRequest } from '../../../../../../../api/requests/Application';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

type IOperation = 'update' | 'close_application' | 'proceed_to_execution' | 'return_for_revision';

type IUpdateOperation = 'update' | 'close_application' | 'proceed_to_execution';

interface IProps {
  data: IGisApplication;
  changeData: React.Dispatch<React.SetStateAction<IGisApplication>>;
  role: IRole;
  exitFromForm: () => void;
  logout: () => void;
  getApplications: () => Promise<void>;
}

export const Buttons: FC<IProps> = ({
  data,
  changeData,
  role,
  exitFromForm,
  logout,
  getApplications,
}) => {
  const { applicationError } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<null | IOperation>(null);
  const [successButton, changeSuccessButton] = useState<null | IOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<null | IOperation>(null);

  const update_application = async (operation_type: IUpdateOperation) => {
    if (!data.status.id || !data.employee || !statuses.length) return;
    let new_status: IStatus | null = null;
    if (operation_type === 'update') changeLoadingButton('update');
    if (operation_type === 'close_application') changeLoadingButton('close_application');
    if (operation_type === 'proceed_to_execution') changeLoadingButton('proceed_to_execution');
    try {
      if (data.status.appStatus === 'Новая' && operation_type === 'update') {
        new_status = statuses.filter((el) => el.appStatus === 'Назначена')[0];
      }
      if (
        ['Назначена', 'Возвращена'].some((el) => el === data.status.appStatus) &&
        operation_type === 'proceed_to_execution'
      ) {
        new_status = statuses.filter((el) => el.appStatus === 'В работе')[0];
      }
      if (
        ['В работе', 'Назначена'].some((el) => el === data.status.appStatus) &&
        operation_type === 'close_application'
      ) {
        new_status = statuses.filter((el) => el.appStatus === 'Закрыта')[0];
      }
    } catch (e) {
      new_status = data.status;
    }
    if (!new_status) new_status = data.status;
    if (errorButton) changeErrorButton(null);

    let info: IUpdateGisAppByDispatcher | IUpdateGisAppByEmployee = {
      employee_comment: !data.employee_comment ? null : data.employee_comment,
      status: new_status.id,
    };
    if (role === 'dispatcher') {
      info = {
        employee: data.employee.id,
        status: new_status.id,
        priority: data.priority.id,
        dispatcher_comment: !data.dispatcher_comment ? null : data.dispatcher_comment,
      };
    }
    const response = await updateGisAppRequest(data.id.toString(), logout, info);
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
    <div className='gap-4 flex max-md:flex-wrap max-md:justify-start justify-center'>
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
            update_application('update');
          }}
          className='text-white bg-blue-700'
          disabled={
            !loadingButton &&
            !successButton &&
            data.status.appStatus !== 'Закрыта' &&
            ((role === 'dispatcher' &&
              ((data.dispatcher_comment && data.dispatcher_comment.length < 501) ||
                !data.dispatcher_comment) &&
              data.priority.id &&
              data.employee &&
              data.employee.id) ||
              (role === 'executor' &&
                data.status.appStatus !== 'Назначена' &&
                data.status.appStatus !== 'Возвращена' &&
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
          {loadingButton !== 'update' && errorButton !== 'update' && successButton !== 'update' && (
            <>Записать</>
          )}
        </Button>
      </ConfigProvider>
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
            update_application('close_application');
          }}
          className='text-white bg-green-700'
          disabled={
            !loadingButton &&
            !successButton &&
            (data.status.appStatus === 'В работе' ||
              ((data.status.appStatus === 'Назначена' || data.status.appStatus === 'Возвращена') &&
                role === 'dispatcher'))
              ? false
              : true
          }
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
      {role === 'executor' && (
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
              update_application('proceed_to_execution');
            }}
            className='text-white bg-amber-500'
            disabled={
              !loadingButton &&
              !successButton &&
              data.status &&
              (data.status.appStatus === 'Назначена' || data.status.appStatus === 'Возвращена')
                ? false
                : true
            }
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
