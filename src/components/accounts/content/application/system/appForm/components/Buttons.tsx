import { FC, useState } from 'react';
import {
  IApplication,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  IStatus,
} from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';
import { Button, ConfigProvider } from 'antd';
import {
  createSystemApplicationRequest,
  updateSystemApplicationByIdRequest,
} from '../../../../../../../api/requests/Application';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  data: IApplication;
  form_id: number;
  role: string;
  exitFromForm: () => void;
  logout: () => void;
  getApplications: () => Promise<void>;
}

type IApplicationOperation =
  | null
  | 'create'
  | 'update'
  | 'close_application'
  | 'proceed_to_execution'
  | 'return_for_revision';

export const Buttons: FC<IProps> = ({
  data,
  form_id,
  role,
  exitFromForm,
  logout,
  getApplications,
}) => {
  const { applicationError } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<IApplicationOperation>(null);
  const [successButton, changeSuccessButton] = useState<IApplicationOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<IApplicationOperation>(null);

  const makeCreateApplication = async () => {
    changeLoadingButton('create');
    if (errorButton) changeErrorButton(null);
    let info: IAppCreateByCitizen | IAppCreateByDispatcher = {
      subtype: data.subtype.id,
      type: data.type.id,
      applicant_comment: data.applicant_comment,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
      contact: data.contact,
      applicant_fio: data.applicant_fio,
    };
    if (role === 'dispatcher') {
      info = {
        priority: data.priority.id,
        source: data.source.id,
        subtype: data.subtype.id,
        type: data.type.id,
        applicant_comment: data.applicant_comment,
        complex: data.complex.id,
        building: data.building.id,
        possession: data.possession.id,
        employee: !data.employee ? null : data.employee.id,
        contact: data.contact,
        dispatcher_comment: data.dispatcher_comment,
        applicant_fio: data.applicant_fio,
      };
    }

    const response = await createSystemApplicationRequest(logout, info);
    changeLoadingButton(null);
    if (response === 201) {
      changeSuccessButton((prev) => 'create');
      setTimeout(async () => {
        changeSuccessButton((prev) => null);
        exitFromForm();
        getApplications();
      }, 2000);
    } else {
      if (response && 'type' in response) applicationError(response);
      changeErrorButton('create');
      setTimeout(() => changeErrorButton(null), 2000);
    }
  };

  const makeUpdateApplication = async (
    new_status: IStatus,
    operation_type: IApplicationOperation,
  ) => {
    if (operation_type === 'create') return;
    if (operation_type === 'update') changeLoadingButton('update');
    if (operation_type === 'close_application') changeLoadingButton('close_application');
    if (operation_type === 'proceed_to_execution') changeLoadingButton('proceed_to_execution');
    if (operation_type === 'return_for_revision') changeLoadingButton('return_for_revision');

    if (errorButton) changeErrorButton(null);

    let info: IAppUpdateByEmployee | IAppUpdateByDispatcher = {
      employee_comment: data.employee_comment,
      status: new_status.id,
    };
    if (role === 'dispatcher') {
      info = {
        employee: !data.employee ? null : data.employee.id,
        type: data.type.id,
        subtype: data.subtype.id,
        source: data.source.id,
        priority: data.priority.id,
        dispatcher_comment: data.dispatcher_comment,
        status: new_status.id,
      };
    }
    const response = await updateSystemApplicationByIdRequest(form_id.toString(), logout, info);
    changeLoadingButton(null);
    if (response === 200) {
      if (operation_type === 'update') changeSuccessButton('update');
      if (operation_type === 'close_application') changeSuccessButton('close_application');
      if (operation_type === 'proceed_to_execution') changeSuccessButton('proceed_to_execution');
      if (operation_type === 'return_for_revision') changeSuccessButton('return_for_revision');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        getApplications();
        exitFromForm();
      }, 2000);
    } else {
      if (operation_type === 'update') changeErrorButton('update');
      if (operation_type === 'close_application') changeErrorButton('close_application');
      if (operation_type === 'proceed_to_execution') changeErrorButton('proceed_to_execution');
      if (operation_type === 'return_for_revision') changeErrorButton('return_for_revision');
      if (response && 'type' in response) applicationError(response);
      setTimeout(() => changeErrorButton(null), 2000);
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
              makeCreateApplication();
            }}
            className='text-white bg-blue-700'
            disabled={
              !loadingButton &&
              !successButton &&
              data.building.id &&
              data.complex.id &&
              data.subtype.id &&
              data.possession.id &&
              data.type.id &&
              data.applicant_comment &&
              data.applicant_comment.length < 501 &&
              ((role === 'dispatcher' &&
                ((data.dispatcher_comment && data.dispatcher_comment.length < 501) ||
                  !data.dispatcher_comment) &&
                /^\+\d{11}$/.test(data.contact) &&
                data.employee &&
                data.employee.id &&
                data.source.id &&
                data.status.id &&
                data.priority.id &&
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
                let new_status = data.status;
                if (data.status.name === 'Новая') {
                  const status = statuses.filter((el) => el.name === 'Назначена');
                  if (status.length > 0) {
                    new_status = status[0];
                  }
                }
                makeUpdateApplication(new_status, 'update');
              }}
              className='text-white bg-blue-700'
              disabled={
                !loadingButton &&
                !successButton &&
                data.status.id &&
                data.subtype.id &&
                data.status.name !== 'Закрыта' &&
                ((role === 'dispatcher' &&
                  ((data.dispatcher_comment && data.dispatcher_comment.length < 501) ||
                    !data.dispatcher_comment) &&
                  data.type.id &&
                  data.source.id &&
                  data.building.id &&
                  data.complex.id &&
                  data.possession.id &&
                  data.priority.id &&
                  data.employee &&
                  data.employee.id &&
                  data.applicant_comment) ||
                  (role === 'executor' &&
                    data.status.name !== 'Назначена' &&
                    data.status.name !== 'Возвращена' &&
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
          {data.id > 0 &&
            (data.status.name === 'В работе' ||
              ((data.status.name === 'Назначена' || data.status.name === 'Возвращена') &&
                role === 'dispatcher')) && (
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
                    const new_status = statuses.filter((el) => el.name === 'Закрыта');
                    if (!new_status.length) return;
                    makeUpdateApplication(new_status[0], 'close_application');
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
        </>
      )}
      {form_id !== 0 &&
        role === 'executor' &&
        (data.status.name === 'Назначена' || data.status.name === 'Возвращена') && (
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
                const new_status = statuses.filter((el) => el.name === 'В работе');
                if (!new_status.length) return;
                makeUpdateApplication(new_status[0], 'proceed_to_execution');
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
      {form_id !== 0 && role === 'dispatcher' && data.status.name === 'Закрыта' && (
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
            disabled={!loadingButton && !successButton ? false : true}
            onClick={() => {
              const new_status = statuses.filter((el) => el.name === 'Возвращена');
              if (!new_status.length) return;
              makeUpdateApplication(new_status[0], 'return_for_revision');
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
          className='transition-colors border-white text-white'
          disabled={loadingButton ? true : false}
          onClick={() => {
            getApplications();
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
