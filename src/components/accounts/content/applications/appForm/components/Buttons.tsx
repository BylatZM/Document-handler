import { FC } from 'react';
import {
  IApplication,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  ICar,
  IRole,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  IStatus,
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

interface IProps {
  data: IApplication;
  form_id: number;
  role: IRole;
  exitFromForm: () => void;
  carInfo: ICar | null;
  changeCarInfo: React.Dispatch<React.SetStateAction<ICar | null>>;
  logout: () => void;
}

export const Buttons: FC<IProps> = ({
  data,
  form_id,
  role,
  exitFromForm,
  carInfo,
  changeCarInfo,
  logout,
}) => {
  const { citizenErrors, updateApplication, applicationSuccess } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const { error } = useTypedSelector((state) => state.CitizenReducer);

  const get_applications = async () => {
    const applications = await getApplicationsRequest(logout);
    if (applications) applicationSuccess(applications);
  };

  const create_application = async () => {
    if (!statuses) return;

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
    if (response === 201) await get_applications();
  };

  const update_application_status = async (status: IStatus) => {
    await updateAppStatusRequest(form_id.toString(), logout, status.id);
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
  };

  const update_application = async () => {
    if (!data.status || !data.employee || !statuses) return;

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
    if (response === 200) {
      updateApplication({
        app_id: form_id,
        application: {
          ...data,
          status: data.status.appStatus === 'Новая' ? status : data.status,
        },
      });
    }
  };

  return (
    <div className='gap-4 flex justify-center mt-4'>
      {form_id < 1 && ['citizen', 'dispatcher'].some((el) => el === role.role) && (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: '#1e3a8a',
              },
            },
          }}
        >
          <Button
            onClick={() => {
              exitFromForm();
              create_application();
            }}
            className='transition-colors text-white bg-blue-500'
            disabled={
              data.building &&
              data.complex &&
              data.possession &&
              data.source &&
              data.type &&
              data.citizenComment &&
              data.citizenComment.length < 501 &&
              ((role.role === 'dispatcher' &&
                ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                  !data.dispatcherComment) &&
                data.employee &&
                data.status &&
                data.priority &&
                data.grade) ||
                role.role === 'citizen')
                ? false
                : true
            }
          >
            Создать
          </Button>
        </ConfigProvider>
      )}
      {form_id !== 0 && ['dispatcher', 'executor'].some((el) => el === role.role) && (
        <>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: '#1e3a8a',
                },
              },
            }}
          >
            <Button
              onClick={() => {
                update_application();
                exitFromForm();
                if (carInfo) changeCarInfo(null);
                if (error) citizenErrors(null);
              }}
              className='transition-colors text-white bg-blue-500'
              disabled={
                data.status &&
                data.status.appStatus !== 'Закрыта' &&
                ((role.role === 'dispatcher' &&
                  ((data.dispatcherComment && data.dispatcherComment.length < 501) ||
                    !data.dispatcherComment) &&
                  data.type.id &&
                  data.source.id &&
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
              Обновить
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: '#15803d',
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
              className='transition-colors text-white bg-green-500'
              disabled={data.status && data.status.appStatus === 'В работе' ? false : true}
            >
              Заявка выполнена
            </Button>
          </ConfigProvider>
        </>
      )}
      {form_id !== 0 && role.role === 'executor' && (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: '#b45309',
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
            className='transition-colors text-white bg-amber-500'
            disabled={
              data.status &&
              (data.status.appStatus === 'Назначена' || data.status.appStatus === 'Возвращена')
                ? false
                : true
            }
          >
            Приступить к исполнению
          </Button>
        </ConfigProvider>
      )}
      {form_id !== 0 && role.role === 'dispatcher' && (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: '#b45309',
              },
            },
          }}
        >
          <Button
            disabled={data.status && data.status.appStatus === 'Закрыта' ? false : true}
            onClick={() => {
              if (statuses) {
                const new_status: IStatus = statuses.filter(
                  (el) => el.appStatus === 'Возвращена',
                )[0];
                update_application_status(new_status);
              }
            }}
            className='transition-colors text-white bg-amber-500'
          >
            Вернуть на доработку
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
          onClick={() => {
            exitFromForm();
            if (carInfo) changeCarInfo(null);
            if (error) citizenErrors(null);
          }}
        >
          Закрыть
        </Button>
      </ConfigProvider>
    </div>
  );
};
