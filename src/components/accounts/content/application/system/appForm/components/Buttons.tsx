import { FC, useState } from 'react';
import {
  IApplication,
  IAppCreateByDispatcher,
  IAppCreateByCitizen,
  IAppUpdateByDispatcher,
  IAppUpdateByEmployee,
  IStatus,
  IAddingFile,
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
import { loadSystemApplicationFilesRequest } from '../../../../../../../api/requests/Application';

interface IProps {
  data: IApplication;
  setData: React.Dispatch<React.SetStateAction<IApplication>>;
  form_id: number;
  role: string;
  exitFromForm: () => void;
  logout: () => void;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  addingCitizenFiles: IAddingFile[];
  addingEmployeeFiles: IAddingFile[];
  setPreviewTitle: React.Dispatch<React.SetStateAction<string>>;
  setGradePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IApplicationOperation =
  | null
  | 'create'
  | 'update'
  | 'close_application'
  | 'proceed_to_execution'
  | 'return_for_revision'
  | 'got_incorrectly';

export const Buttons: FC<IProps> = ({
  data,
  setData,
  form_id,
  role,
  exitFromForm,
  logout,
  changeIsNeedToGet,
  addingCitizenFiles,
  addingEmployeeFiles,
  setPreviewTitle,
  setGradePreviewOpen,
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
    if (role === 'dispatcher' && data.employee) {
      info = {
        priority: data.priority.id,
        source: data.source.id,
        subtype: data.subtype.id,
        type: data.type.id,
        applicant_comment: data.applicant_comment,
        complex: data.complex.id,
        building: data.building.id,
        possession: data.possession.id,
        employee: data.employee.id,
        contact: data.contact,
        dispatcher_comment: data.dispatcher_comment,
        applicant_fio: data.applicant_fio,
      };
    }

    const response = await createSystemApplicationRequest(logout, info);
    if (
      response &&
      typeof response !== 'number' &&
      addingCitizenFiles.length > 0 &&
      'application_id' in response
    ) {
      let files = new FormData();
      addingCitizenFiles.forEach((item) => files.append('files', item.file, item.file.name));
      files.append('application_id', response.application_id.toString());
      await loadSystemApplicationFilesRequest(logout, files);
    }
    changeLoadingButton(null);
    if (response === 201 || (response && 'application_id' in response)) {
      changeSuccessButton((prev) => 'create');
      setTimeout(async () => {
        changeSuccessButton((prev) => null);
        exitFromForm();
        changeIsNeedToGet(true);
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
    if (operation_type === 'got_incorrectly') changeLoadingButton('got_incorrectly');

    if (errorButton) changeErrorButton(null);

    let info: IAppUpdateByEmployee | IAppUpdateByDispatcher = {
      status: new_status.id,
    };
    if (operation_type === 'update') {
      if (role === 'dispatcher') {
        info = {
          ...info,
          employee: !data.employee ? null : data.employee.id,
          type: data.type.id,
          subtype: data.subtype.id,
          source: data.source.id,
          priority: data.priority.id,
          dispatcher_comment: data.dispatcher_comment,
        };
      }
      if (role === 'executor') {
        info = {
          ...info,
          employee_comment: data.employee_comment,
        };
      }
    }
    if (operation_type === 'close_application') {
      if (role === 'dispatcher') {
        info = {
          ...info,
          employee: !data.employee ? null : data.employee.id,
          type: data.type.id,
          subtype: data.subtype.id,
          source: data.source.id,
          priority: data.priority.id,
          dispatcher_comment: data.dispatcher_comment,
        };
      }
      if (role === 'executor') {
        info = {
          ...info,
          employee_comment: data.employee_comment,
        };
      }
    }
    const response = await updateSystemApplicationByIdRequest(form_id.toString(), logout, info);
    if (
      role === 'executor' &&
      operation_type === 'close_application' &&
      addingEmployeeFiles.length > 0
    ) {
      let files = new FormData();
      addingEmployeeFiles.forEach((item) => files.append('files', item.file, item.file.name));
      files.append('application_id', form_id.toString());
      await loadSystemApplicationFilesRequest(logout, files);
    }
    changeLoadingButton(null);
    if (response === 200) {
      if (operation_type === 'update') changeSuccessButton('update');
      if (operation_type === 'close_application') changeSuccessButton('close_application');
      if (operation_type === 'proceed_to_execution') changeSuccessButton('proceed_to_execution');
      if (operation_type === 'return_for_revision') changeSuccessButton('return_for_revision');
      if (operation_type === 'got_incorrectly') changeSuccessButton('got_incorrectly');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        if (operation_type === 'close_application' && data.applicant.role === 'citizen') {
          setPreviewTitle('Оцените работу с жителем');
          setGradePreviewOpen(true);
        }
        if (operation_type === 'proceed_to_execution') {
          setData((prev) => ({ ...prev, status: { ...new_status } }));
        }
        if (operation_type === 'return_for_revision') {
          if (!data.employee) {
            const status = statuses.filter((el) => el.name === 'Новая');
            if (!status.length) {
              setData((prev) => ({
                ...prev,
                status: { ...new_status },
                dispatcher_comment: null,
                employee_comment: null,
              }));
            } else {
              setData((prev) => ({
                ...prev,
                status: { ...status[0] },
                dispatcher_comment: null,
                employee_comment: null,
              }));
            }
          } else {
            setData((prev) => ({
              ...prev,
              status: { ...new_status },
              dispatcher_comment: null,
              employee_comment: null,
            }));
          }
        }
        if (
          !['proceed_to_execution', 'return_for_revision', 'close_application'].some(
            (el) => el === operation_type,
          ) ||
          (operation_type === 'close_application' && data.applicant.role !== 'citizen')
        ) {
          exitFromForm();
          changeIsNeedToGet(true);
        }
      }, 2000);
    } else {
      if (operation_type === 'update') changeErrorButton('update');
      if (operation_type === 'close_application') changeErrorButton('close_application');
      if (operation_type === 'proceed_to_execution') changeErrorButton('proceed_to_execution');
      if (operation_type === 'return_for_revision') changeErrorButton('return_for_revision');
      if (operation_type === 'got_incorrectly') changeErrorButton('got_incorrectly');
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
      {form_id !== 0 &&
        data.status.name !== 'Закрыта' &&
        data.status.name !== 'Заведена неверно' &&
        (role === 'dispatcher' ||
          (role === 'executor' &&
            data.status.name !== 'Назначена' &&
            data.status.name !== 'Возвращена')) && (
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
              ((role === 'executor' && data.status.name === 'В работе') ||
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
                    disabled={
                      !loadingButton &&
                      !successButton &&
                      data.employee &&
                      data.type.id &&
                      data.subtype.id
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
      {form_id !== 0 &&
        role === 'dispatcher' &&
        (data.status.name === 'Закрыта' || data.status.name === 'Заведена неверно') && (
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
      {form_id !== 0 &&
        (role === 'dispatcher' || role === 'executor') &&
        data.status.name !== 'Закрыта' &&
        data.status.name !== 'Заведена неверно' && (
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
                const new_status = statuses.filter((el) => el.name === 'Заведена неверно');
                if (!new_status.length) return;
                makeUpdateApplication(new_status[0], 'got_incorrectly');
              }}
              className='text-white bg-gray-500'
            >
              {loadingButton === 'got_incorrectly' && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
              {errorButton === 'got_incorrectly' && !loadingButton && !successButton && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
                </div>
              )}
              {!loadingButton && !errorButton && successButton === 'got_incorrectly' && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
              {loadingButton !== 'got_incorrectly' &&
                errorButton !== 'got_incorrectly' &&
                successButton !== 'got_incorrectly' && <>Заведена неверно</>}
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
            changeIsNeedToGet(true);
            if (errorButton) changeErrorButton(null);
          }}
        >
          Закрыть
        </Button>
      </ConfigProvider>
    </div>
  );
};
