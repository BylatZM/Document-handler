import { FC, useState } from 'react';
import {
  IApplication,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IRole,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  IStatus,
  IPossession,
  IBuilding,
} from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { Button, ConfigProvider } from 'antd';
import {
  createApplicationsRequest,
  getApplicationsRequest,
  updateAppRequest,
  updateAppStatusRequest,
} from '../../../../../../api/requests/Application';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import clsx from 'clsx';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  data: IApplication;
  form_id: number;
  role: IRole;
  exitFromForm: () => void;
  logout: () => void;
  buildings: IBuilding[] | null;
  possessions: IPossession[] | null;
  changeData: React.Dispatch<React.SetStateAction<IApplication>>;
  refreshFormData: () => void;
}

export const Buttons: FC<IProps> = ({
  data,
  form_id,
  role,
  exitFromForm,
  logout,
  buildings,
  possessions,
  changeData,
  refreshFormData,
}) => {
  const { updateApplication, applicationSuccess } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<
    | null
    | 'create'
    | 'update'
    | 'close_application'
    | 'proceed_to_execution'
    | 'return_for_revision'
  >(null);
  const [successButton, changeSuccessButton] = useState<
    | null
    | 'create'
    | 'update'
    | 'close_application'
    | 'proceed_to_execution'
    | 'return_for_revision'
  >(null);
  const [loadingButton, changeLoadingButton] = useState<
    | null
    | 'create'
    | 'update'
    | 'close_application'
    | 'proceed_to_execution'
    | 'return_for_revision'
  >(null);

  const get_applications = async () => {
    const applications = await getApplicationsRequest(logout);
    if (applications) applicationSuccess(applications);
  };

  const create_application = async () => {
    if (!statuses.length || !data.subtype || !data.type) return;
    changeLoadingButton('create');
    if (errorButton) changeErrorButton(null);
    let info: IAppCreateByCitizen | IAppCreateByDispatcher = {
      subtype: data.subtype.id,
      type: data.type.id,
      citizenComment: data.citizenComment,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
      contact: data.contact,
      citizenFio: data.citizenFio,
    };
    if (role === 'dispatcher') {
      info = {
        priority: data.priority.id,
        source: data.source.id,
        subtype: data.subtype.id,
        type: data.type.id,
        citizenComment: data.citizenComment,
        complex: data.complex.id,
        building: data.building.id,
        possession: data.possession.id,
        employee: data.employee.id,
        contact: data.contact,
        dispatcherComment: data.dispatcherComment,
        citizenFio: data.citizenFio,
      };
    }

    const response = await createApplicationsRequest(logout, info);
    changeLoadingButton(null);
    if (response === 201) {
      changeSuccessButton((prev) => 'create');
      setTimeout(async () => {
        changeSuccessButton((prev) => null);
        exitFromForm();
        await get_applications();
      }, 2000);
    } else {
      changeErrorButton('create');
    }
  };

  const update_application_status = async (status: IStatus) => {
    if (status.appStatus === 'Закрыта') changeLoadingButton('close_application');
    if (status.appStatus === 'Возвращена') changeLoadingButton('return_for_revision');
    if (status.appStatus === 'В работе') changeLoadingButton('proceed_to_execution');

    if (errorButton) changeErrorButton(null);

    const response = await updateAppStatusRequest(form_id.toString(), logout, status.id);
    changeLoadingButton(null);
    if (response === 200) {
      updateApplication({
        app_id: form_id,
        application: {
          ...data,
          status: { id: status.id, appStatus: status.appStatus },
        },
      });
      if (status.appStatus === 'Закрыта') {
        changeSuccessButton((prev) => 'close_application');
        await get_applications();
      }
      if (status.appStatus === 'Возвращена') changeSuccessButton((prev) => 'return_for_revision');
      if (status.appStatus === 'В работе') changeSuccessButton((prev) => 'proceed_to_execution');
      setTimeout(async () => {
        changeSuccessButton((prev) => null);
        exitFromForm();
      }, 2000);
    } else {
      if (status.appStatus === 'Закрыта') changeErrorButton((prev) => 'close_application');
      if (status.appStatus === 'Возвращена') changeErrorButton((prev) => 'return_for_revision');
      if (status.appStatus === 'В работе') changeErrorButton((prev) => 'proceed_to_execution');
    }
  };

  const update_application = async () => {
    if (!data.status || !data.employee || !statuses.length || !data.subtype) return;

    changeLoadingButton('update');
    if (errorButton) changeErrorButton(null);

    let info: IAppUpdateByEmployee | IAppUpdateByDispatcher = {
      employeeComment: data.employeeComment,
    };
    const status = statuses.filter((el) => el.appStatus === 'Назначена')[0];
    if (role === 'dispatcher') {
      if (!data.type) return;
      info = {
        employee: data.employee.id,
        type: data.type.id,
        subtype: data.subtype.id,
        source: data.source.id,
        priority: data.priority.id,
        dispatcherComment: data.dispatcherComment,
      };
    }
    const response = await updateAppRequest(form_id.toString(), logout, info);
    changeLoadingButton(null);
    if (response === 200) {
      updateApplication({
        app_id: form_id,
        application: {
          ...data,
          status: data.status.appStatus === 'Новая' ? status : data.status,
        },
      });
      changeSuccessButton((prev) => 'update');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        exitFromForm();
      }, 2000);
    } else {
      changeErrorButton('create');
    }
  };

  return (
    <div className='gap-4 flex max-md:flex-wrap max-md:justify-start justify-center'>
      {form_id < 1 && ['citizen', 'dispatcher'].some((el) => el === role) && (
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
              create_application();
            }}
            className='text-white bg-blue-700'
            disabled={
              !loadingButton &&
              !successButton &&
              data.building.id &&
              data.complex.id &&
              data.subtype &&
              data.subtype.id &&
              data.possession.id &&
              data.type &&
              data.citizenComment &&
              data.citizenComment.length < 501 &&
              ((role === 'dispatcher' &&
                ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                  !data.dispatcherComment) &&
                data.employee &&
                /^\+\d{11}$/.test(data.contact) &&
                data.employee.id &&
                data.source.id &&
                data.status &&
                data.status.id &&
                data.priority &&
                data.priority.id &&
                data.grade &&
                data.grade.id) ||
                role === 'citizen')
                ? false
                : true
            }
          >
            {loadingButton === 'create' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'create' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'create' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'create' &&
              errorButton !== 'create' &&
              successButton !== 'create' && <>Создать</>}
          </Button>
        </ConfigProvider>
      )}
      {form_id !== 0 && ['dispatcher', 'executor'].some((el) => el === role) && (
        <>
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
                update_application();
              }}
              className='text-white bg-blue-700'
              disabled={
                !loadingButton &&
                !successButton &&
                data.status &&
                data.subtype &&
                data.subtype.id &&
                data.status.appStatus !== 'Закрыта' &&
                ((role === 'dispatcher' &&
                  ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                    !data.dispatcherComment) &&
                  data.type &&
                  data.source.id &&
                  data.building.id &&
                  data.complex.id &&
                  data.possession.id &&
                  data.priority &&
                  data.priority.id &&
                  data.employee &&
                  data.employee.id &&
                  data.citizenComment) ||
                  (role === 'executor' &&
                    data.status.appStatus !== 'Назначена' &&
                    data.status.appStatus !== 'Возвращена' &&
                    data.employeeComment &&
                    data.employeeComment.length < 501))
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
                if (statuses) {
                  const new_status: IStatus = statuses.filter(
                    (el) => el.appStatus === 'Закрыта',
                  )[0];
                  update_application_status(new_status);
                }
              }}
              className='text-white bg-green-700'
              disabled={
                !loadingButton &&
                !successButton &&
                data.status &&
                data.status.appStatus === 'В работе'
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
        </>
      )}
      {form_id !== 0 && role === 'executor' && (
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
              if (statuses) {
                const new_status: IStatus = statuses.filter((el) => el.appStatus === 'В работе')[0];
                update_application_status(new_status);
              }
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
      {form_id !== 0 && role === 'dispatcher' && (
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
            disabled={
              !loadingButton && !successButton && data.status && data.status.appStatus === 'Закрыта'
                ? false
                : true
            }
            onClick={() => {
              if (statuses) {
                const new_status: IStatus = statuses.filter(
                  (el) => el.appStatus === 'Возвращена',
                )[0];
                update_application_status(new_status);
              }
            }}
            className='text-white bg-amber-500'
          >
            {loadingButton === 'return_for_revision' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'return_for_revision' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'return_for_revision' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'return_for_revision' &&
              errorButton !== 'return_for_revision' &&
              successButton !== 'return_for_revision' && <>Вернуть на доработку</>}
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
          className='transition-colors border-blue-500 text-blue-500'
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
