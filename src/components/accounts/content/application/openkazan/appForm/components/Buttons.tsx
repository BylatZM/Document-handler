import React, { FC, useState } from 'react';
import {
  IOpenKazanApplication,
} from '../../../../../../types';
import { Button, ConfigProvider } from 'antd';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import { updateOpenKazanAppByDispatcherSetCloseStatusRequest, updateOpenKazanAppByEmployeeSetCloseStatusRequest, updateOpenKazanAppByEmployeeSetInWorkStatusRequest } from '../../../../../../../api/requests/Application';
import { useActions } from '../../../../../../hooks/useActions';

type IOperation =
  | 'close_application'
  | 'proceed_to_execution'

type Irl = 'dispatcher' | 'executor'

interface IProps {
  data: IOpenKazanApplication;
  role: string;
  exitFromForm: () => void;
  changeData: React.Dispatch<React.SetStateAction<IOpenKazanApplication>>
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

export const Buttons: FC<IProps> = ({ data, role, exitFromForm, changeData, changeIsNeedToGet, logout }) => {
  const { statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const [errorButton, changeErrorButton] = useState<null | IOperation>(null);
  const [successButton, changeSuccessButton] = useState<null | IOperation>(null);
  const [loadingButton, changeLoadingButton] = useState<null | IOperation>(null);
  const { applicationError } = useActions()

  const makeUpdateSetCloseStatusById = async (application_id: string, comment: string, who_close: Irl) => {
    if (errorButton){
      changeErrorButton(null)
    }
    changeLoadingButton('close_application')
    let response = null
    if (who_close === 'dispatcher'){
      response = await updateOpenKazanAppByDispatcherSetCloseStatusRequest(application_id, logout, comment)
    }else {
      response = await updateOpenKazanAppByEmployeeSetCloseStatusRequest(application_id, logout, comment)
    }
    changeLoadingButton(null)
    if (!response) return
    if (typeof response === 'number') {
      changeSuccessButton('close_application')
      setTimeout(() => {
        changeSuccessButton(null)
        exitFromForm()
        changeIsNeedToGet(true)
      }, 2000)
    }
    else{
      changeErrorButton('close_application')
      applicationError(response)
      setTimeout(() => {
        changeErrorButton(null)
      }, 2000)
    }
  }

 const makeUpdatByEmployeeSetInWorkStatusById = async (application_id: string) => {
  if (errorButton){
    changeErrorButton(null)
  }
  changeLoadingButton('proceed_to_execution')
  let response = null
  response = await updateOpenKazanAppByEmployeeSetInWorkStatusRequest(application_id, logout)
  changeLoadingButton(null)
  if (!response) return
  changeSuccessButton('proceed_to_execution')
  setTimeout(() => {
    const new_status = statuses.filter(el => el.name === 'В работе')
    if (!new_status.length){
      exitFromForm()
      changeIsNeedToGet(true)
    }else{
      changeData(prev => ({...prev, status: new_status[0]}))
    }
    changeSuccessButton(null)
  }, 2000)
 }

  return (
    <div className='gap-4 flex flex-wrap justify-center'>
            {
        (role !== 'dispatcher' && role === 'executor' && ['Возвращена', 'Назначена'].some(el => el === data.status.name))
         && (
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
              makeUpdatByEmployeeSetInWorkStatusById(data.id.toString());
            }}
            className='text-white bg-blue-700'
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
      {
        ((role === 'dispatcher' && ['Назначена', 'Возвращена'].some(el => el === data.status.name)) || (role === 'executor' && data.status.name === 'В работе'))
         && (
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
              let comment = ""
              let rl: Irl = "dispatcher"
              if (role === 'dispatcher') {
                comment = data.dispatcher_comment
              }
              if (role === 'executor') {
                comment = data.employee_comment
                rl = 'executor'
              }
              makeUpdateSetCloseStatusById(data.id.toString(), comment, rl);
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
            changeIsNeedToGet(true)
            if (errorButton) changeErrorButton(null);
          }}
        >
          Закрыть
        </Button>
      </ConfigProvider>
    </div>
  );
};
