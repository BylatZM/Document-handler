import { FC, useState } from 'react';
import {
  IStatus,
  IEmailApplication,
  IUpdateEmailAppByDispatcher,
  IUpdateEmailAppByEmployee,
  IAddingFile,
} from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';
import { Button, ConfigProvider } from 'antd';
import {
  loadEmailApplicationFilesRequest,
  updateEmailApplicationByIdRequest,
} from '../../../../../../../api/requests/Application';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

type IOperation =
  | 'update'
  | 'close_application'
  | 'proceed_to_execution'
  | 'return_for_revision'
  | 'got_incorrectly';

interface IProps {
  data: IEmailApplication;
  setData: React.Dispatch<React.SetStateAction<IEmailApplication>>;
  role: string;
  exitFromForm: () => void;
  logout: () => void;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  addingEmployeeFiles: IAddingFile[];
}

export const Buttons: FC<IProps> = ({
  data,
  setData,
  role,
  exitFromForm,
  logout,
  changeIsNeedToGet,
  addingEmployeeFiles,
}) => {
  const { applicationError } = useActions();
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<null | IOperation>(null);
  const [successButton, changeSuccessButton] = useState<null | IOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<null | IOperation>(null);

  const makeUpdateEmailApplication = async (new_status: IStatus[], operation_type: IOperation) => {
    if (operation_type === 'update') changeLoadingButton('update');
    if (operation_type === 'close_application') changeLoadingButton('close_application');
    if (operation_type === 'proceed_to_execution') changeLoadingButton('proceed_to_execution');
    if (operation_type === 'got_incorrectly') changeLoadingButton('got_incorrectly');
    if (operation_type === 'return_for_revision') changeLoadingButton('return_for_revision');
    if (operation_type === 'return_for_revision') changeLoadingButton('return_for_revision');

    let info: IUpdateEmailAppByDispatcher | IUpdateEmailAppByEmployee = {
      status: new_status[0].id,
    };
    if (operation_type === 'update') {
      if (role === 'dispatcher') {
        if (!data.type || !data.subtype || !data.employee || !data.complex || !new_status.length)
          return;
        info = {
          ...info,
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
          employee_comment: data.employee_comment,
        };
      }
    }
    if (
      ['В работе', 'Назначена', 'Возвращена'].some((el) => el === data.status.name) &&
      operation_type === 'close_application'
    ) {
      new_status = statuses.filter((el) => el.name === 'Закрыта');
      if (!new_status.length) return;
      if (role === 'executor') {
        info = { ...info, employee_comment: data.employee_comment };
      }
      if (role === 'dispatcher') {
        if (!data.type || !data.subtype || !data.employee || !data.complex || !new_status.length)
          return;
        info = {
          ...info,
          type: data.type.id,
          subtype: data.subtype.id,
          priority: data.priority.id,
          employee: data.employee.id,
          complex: data.complex.id,
          dispatcher_comment: data.dispatcher_comment,
        };
      }
    }
    if (errorButton) changeErrorButton(null);

    const response = await updateEmailApplicationByIdRequest(data.id.toString(), logout, info);
    if (
      role === 'executor' &&
      operation_type === 'close_application' &&
      addingEmployeeFiles.length > 0
    ) {
      let files = new FormData();
      addingEmployeeFiles.forEach((item) => files.append('files', item.file, item.file.name));
      files.append('application_id', data.id.toString());
      await loadEmailApplicationFilesRequest(logout, files);
    }
    changeLoadingButton(null);
    if (response === 200) {
      if (operation_type === 'update') changeSuccessButton('update');
      if (operation_type === 'close_application') changeSuccessButton('close_application');
      if (operation_type === 'proceed_to_execution') changeSuccessButton('proceed_to_execution');
      if (operation_type === 'got_incorrectly') changeSuccessButton('got_incorrectly');
      if (operation_type === 'return_for_revision') changeSuccessButton('return_for_revision');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        if (operation_type === 'proceed_to_execution') {
          setData((prev) => ({ ...prev, status: { ...new_status[0] } }));
        }
        if (operation_type === 'return_for_revision') {
          setData((prev) => ({
            ...prev,
            status: { ...new_status[0] },
            dispatcher_comment: null,
            employee_comment: null,
          }));
        }
        if (!['proceed_to_execution', 'return_for_revision'].some((el) => el === operation_type)) {
          exitFromForm();
          changeIsNeedToGet(true);
        }
      }, 2000);
    } else {
      if (response && 'type' in response) applicationError(response);
      if (operation_type === 'update') changeErrorButton('update');
      if (operation_type === 'close_application') changeErrorButton('close_application');
      if (operation_type === 'proceed_to_execution') changeErrorButton('proceed_to_execution');
      if (operation_type === 'got_incorrectly') changeErrorButton('got_incorrectly');
      if (operation_type === 'return_for_revision') changeErrorButton('return_for_revision');
      setTimeout(() => changeErrorButton(null), 2000);
    }
  };

  return (
    <div className='gap-4 flex flex-wrap justify-center'>
      {data.status.name !== 'Закрыта' &&
        data.status.name !== 'Заведена неверно' &&
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
                let new_status = statuses.filter((el) => el.name === data.status.name);
                if (data.status.name === 'Новая') {
                  new_status = statuses.filter((el) => el.name === 'Назначена');
                }
                if (!new_status.length) return;
                makeUpdateEmailApplication(new_status, 'update');
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
              makeUpdateEmailApplication(new_status, 'close_application');
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
      {role === 'executor' &&
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
                makeUpdateEmailApplication(new_status, 'proceed_to_execution');
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
      {role === 'dispatcher' &&
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
                makeUpdateEmailApplication(new_status, 'return_for_revision');
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
      {(((data.status.name === 'Новая' ||
        data.status.name === 'Назначена' ||
        data.status.name === 'Возвращена') &&
        role === 'dispatcher') ||
        (role === 'executor' && data.status.name === 'В работе')) && (
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
              const new_status = statuses.filter((el) => el.name === 'Заведена неверно');
              if (!new_status.length) return;
              makeUpdateEmailApplication(new_status, 'got_incorrectly');
            }}
            className='text-white bg-gray-500'
            disabled={!loadingButton && !successButton ? false : true}
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
