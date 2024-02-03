import { FC, useState } from 'react';
import {
  IApplication,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  ICar,
  IRole,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  IStatus,
  IBuilding,
  IPossession,
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
}

export const Buttons: FC<IProps> = ({
  data,
  form_id,
  role,
  exitFromForm,
  logout,
  buildings,
  possessions,
}) => {
  const { updateApplication, applicationSuccess, buildingSuccess, possessionSuccess } =
    useActions();
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
    if (!statuses) return;
    changeLoadingButton('create');
    if (errorButton) changeErrorButton(null);
    let info: IAppCreateByCitizen | IAppCreateByDispatcher = {
      source: data.source.id,
      grade: 1,
      type: data.type.id,
      citizenComment: data.citizenComment,
      isAppeal: data.isAppeal,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
      status: statuses.filter((el) => el.appStatus === 'Новая')[0].id,
    };
    if (role.role === 'dispatcher' && data.priority && data.employee) {
      info = {
        grade: 1,
        status: statuses.filter((el) => el.appStatus === 'Назначена')[0].id,
        priority: data.priority.id,
        source: data.source.id,
        type: data.type.id,
        citizenComment: data.citizenComment,
        isAppeal: data.isAppeal,
        complex: data.complex.id,
        building: data.building.id,
        possession: data.possession.id,
        employee: data.employee.id,
      };
      if (data.dispatcherComment && role.role === 'dispatcher')
        info = {
          ...info,
          dispatcherComment: data.dispatcherComment,
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
      if (status.appStatus === 'Закрыта') changeSuccessButton((prev) => 'close_application');
      if (status.appStatus === 'Возвращена') changeSuccessButton((prev) => 'return_for_revision');
      if (status.appStatus === 'В работе') changeSuccessButton((prev) => 'proceed_to_execution');
      setTimeout(async () => {
        changeSuccessButton((prev) => null);
        updateApplication({
          app_id: form_id,
          application: {
            ...data,
            status: { id: status.id, appStatus: status.appStatus },
          },
        });
        exitFromForm();
        if (status.appStatus === 'Закрыта' || status.appStatus === 'Возвращена')
          await get_applications();
      }, 2000);
    } else {
      if (status.appStatus === 'Закрыта') changeErrorButton((prev) => 'close_application');
      if (status.appStatus === 'Возвращена') changeErrorButton((prev) => 'return_for_revision');
      if (status.appStatus === 'В работе') changeErrorButton((prev) => 'proceed_to_execution');
    }
  };

  const update_application = async () => {
    if (!data.status || !data.employee || !statuses) return;

    changeLoadingButton('update');
    if (errorButton) changeErrorButton(null);

    let info: IAppUpdateByEmployee | IAppUpdateByDispatcher = {
      employeeComment: data.employeeComment,
    };
    const status = statuses.filter((el) => el.appStatus === 'Назначена')[0];
    if (role.role === 'dispatcher') {
      if (!data.priority) return;
      info = {
        isAppeal: data.isAppeal,
        citizenComment: data.citizenComment,
        employee: data.employee.id,
        type: data.type.id,
        status: data.status.appStatus === 'Новая' ? status.id : data.status.id,
        source: data.source.id,
        priority: data.priority.id,
      };
      if (data.dispatcherComment) {
        info = {
          ...info,
          dispatcherComment: data.dispatcherComment,
        };
      }
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
    <div className='gap-4 flex justify-center'>
      {form_id < 1 && ['citizen', 'dispatcher'].some((el) => el === role.role) && (
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
            className={clsx(
              ' text-white',
              errorButton !== 'create' && successButton !== 'create' && 'bg-blue-700',
              errorButton === 'create' && !successButton && !loadingButton && 'bg-red-500',
              !errorButton && successButton === 'create' && !loadingButton && 'bg-green-500',
            )}
            disabled={
              (!loadingButton || loadingButton === 'create') &&
              data.building.id &&
              data.complex.id &&
              data.possession.id &&
              data.source.id &&
              data.type.id &&
              data.citizenComment &&
              data.citizenComment.length < 501 &&
              ((role.role === 'dispatcher' &&
                ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                  !data.dispatcherComment) &&
                data.employee &&
                data.employee.id &&
                data.status &&
                data.status.id &&
                data.priority &&
                data.priority.id &&
                data.grade &&
                data.grade.id) ||
                role.role === 'citizen')
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
      {form_id !== 0 && ['dispatcher', 'executor'].some((el) => el === role.role) && (
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
              className={clsx(
                ' text-white',
                errorButton !== 'update' && successButton !== 'update' && 'bg-blue-700',
                errorButton === 'update' && !successButton && !loadingButton && 'bg-red-500',
                !errorButton && successButton === 'update' && !loadingButton && 'bg-green-500',
              )}
              disabled={
                (!loadingButton || loadingButton === 'update') &&
                data.status &&
                data.status.appStatus !== 'Закрыта' &&
                ((role.role === 'dispatcher' &&
                  ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                    !data.dispatcherComment) &&
                  data.type.id &&
                  data.source.id &&
                  data.building.id &&
                  data.complex.id &&
                  data.possession.id &&
                  data.priority &&
                  data.priority.id &&
                  data.employee &&
                  data.employee.id &&
                  data.citizenComment) ||
                  (role.role === 'executor' &&
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
              className={clsx(
                ' text-white',
                errorButton !== 'close_application' &&
                  successButton !== 'close_application' &&
                  'bg-green-700',
                errorButton === 'close_application' &&
                  !successButton &&
                  !loadingButton &&
                  'bg-red-500',
                !errorButton &&
                  successButton === 'close_application' &&
                  !loadingButton &&
                  'bg-green-500',
              )}
              disabled={
                (!loadingButton || loadingButton === 'close_application') &&
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
      {form_id !== 0 && role.role === 'executor' && (
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
            className={clsx(
              ' text-white',
              errorButton !== 'proceed_to_execution' &&
                successButton !== 'proceed_to_execution' &&
                'bg-amber-500',
              errorButton === 'proceed_to_execution' &&
                !successButton &&
                !loadingButton &&
                'bg-red-500',
              !errorButton &&
                successButton === 'proceed_to_execution' &&
                !loadingButton &&
                'bg-green-500',
            )}
            disabled={
              (!loadingButton || loadingButton === 'proceed_to_execution') &&
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
      {form_id !== 0 && role.role === 'dispatcher' && (
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
              (!loadingButton || loadingButton === 'return_for_revision') &&
              data.status &&
              data.status.appStatus === 'Закрыта'
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
            className={clsx(
              ' text-white',
              errorButton !== 'return_for_revision' &&
                successButton !== 'return_for_revision' &&
                'bg-amber-500',
              errorButton === 'return_for_revision' &&
                !successButton &&
                !loadingButton &&
                'bg-red-500',
              !errorButton &&
                successButton === 'return_for_revision' &&
                !loadingButton &&
                'bg-green-500',
            )}
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
            if (buildings) buildingSuccess(null);
            if (possessions) possessionSuccess(null);
            if (errorButton) changeErrorButton(null);
          }}
        >
          Закрыть
        </Button>
      </ConfigProvider>
    </div>
  );
};
