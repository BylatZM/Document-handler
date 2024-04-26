import { FC, useState } from 'react';
import {
  IBuildingWithComplex,
  ICitizenPossession,
  ICitizenLoading,
  IPossession,
  IError,
} from '../../../../../../types';
import { Button, ConfigProvider } from 'antd';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { useActions } from '../../../../../../hooks/useActions';
import {
  createCitizenPossessionRequest,
  deleteCitizenPossessionByIdRequest,
  updateCitizenPossessionByIdRequest,
} from '../../../../../../../api/requests/User';
import { useLogout } from '../../../../../../hooks/useLogout';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProp {
  data: ICitizenPossession;
  isFirstItem: boolean;
  form_id: number;
  updatingFormId: number | null;
  loadingForm: ICitizenLoading;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  checkPossessionsRequestOnError: (
    form_id: number,
    possession_type: string,
    building_id: string,
  ) => Promise<void>;
  getBuildings: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons: FC<IProp> = ({
  data,
  isFirstItem,
  form_id,
  updatingFormId,
  loadingForm,
  changeUpdatingFormId,
  changeNeedUpdateAccountInfo,
  checkPossessionsRequestOnError,
  getBuildings,
  changeNeedShowNotification,
}) => {
  const {
    citizenLoading,
    citizenErrors,
    updateCitizenForm,
    deleteCitizenForm,
    buildingSuccess,
    possessionSuccess,
  } = useActions();
  const logout = useLogout();
  const { error } = useTypedSelector((state) => state.CitizenReducer);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);

  const createCitizenPossession = async () => {
    if (error && error.form_id === form_id) citizenErrors(null);
    citizenLoading({ form_id: form_id, isLoading: true });

    const response = await createCitizenPossessionRequest(logout, {
      personal_account: data.personal_account,
      ownership_status: data.ownership_status,
      possession_type: data.possession_type,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
    });
    if (!response) {
      citizenLoading({ form_id: 0, isLoading: false });
      return;
    }

    if (response === 201) {
      changeNeedShowNotification(true);
      changeUpdatingFormId(null);
      changeNeedUpdateAccountInfo(true);
    } else {
      if (response.type === 'citizen') alert(response.error);
      citizenErrors({ form_id: form_id, error: response });
      setTimeout(() => {
        citizenErrors(null);
      }, 2000);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const updateCitizenPossession = async () => {
    if (error && error.form_id === form_id) citizenErrors(null);
    citizenLoading({ form_id: form_id, isLoading: true });
    const response = await updateCitizenPossessionByIdRequest(form_id, logout, {
      personal_account: data.personal_account,
      ownership_status: data.ownership_status,
      possession_type: data.possession_type,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
    });

    if (!response) {
      citizenLoading({ form_id: 0, isLoading: false });
      return;
    }

    if (response === 200) {
      changeIsRequestSuccess((prev) => !prev);
      updateCitizenForm({
        form_id: form_id,
        citizen: data,
      });
      setTimeout(() => {
        changeUpdatingFormId(null);
        changeNeedUpdateAccountInfo(true);
        changeIsRequestSuccess((prev) => !prev);
      }, 2000);
    } else {
      citizenErrors(response);
      setTimeout(() => {
        citizenErrors(null);
      }, 2000);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const deleteCitizenPossession = async (form_id: number) => {
    deleteCitizenForm({ form_id: form_id });
    if (form_id > 0) await deleteCitizenPossessionByIdRequest(form_id, logout);
  };

  const prepareFormReadyForUpdateRequest = async () => {
    buildingSuccess([]);
    possessionSuccess([]);
    if (error) citizenErrors(null);
    changeUpdatingFormId(form_id);
    if (data.complex.id) await getBuildings(data.complex.id.toString());
    if (data.possession_type && data.building.id)
      await checkPossessionsRequestOnError(
        form_id,
        data.possession_type,
        data.building.id.toString(),
      );
  };

  return (
    <div className='flex max-sm:gap-y-2 max-sm:flex-col max-sm:gap-x-0 gap-4'>
      <Button
        className='text-white bg-blue-700'
        disabled={
          isRequestSuccess ||
          loadingForm.form_id ||
          !data.building.id ||
          !data.complex.id ||
          data.personal_account === '' ||
          !data.possession.id ||
          updatingFormId !== form_id
            ? true
            : false
        }
        onClick={() => {
          if (!/^\d+$/.test(data.personal_account) || data.personal_account.length < 10) {
            citizenErrors({
              form_id: form_id,
              error: {
                type: 'personal_account',
                error:
                  'Лицевой счет должен состоять только из цифр, количество символов от 10 до 15',
              },
            });
            citizenLoading({ form_id: 0, isLoading: false });
            return;
          }
          form_id < 1 ? createCitizenPossession() : updateCitizenPossession();
        }}
        type='primary'
      >
        {form_id < 1 &&
          loadingForm.form_id !== form_id &&
          (!error || (error && updatingFormId !== form_id)) &&
          (!isRequestSuccess || (isRequestSuccess && updatingFormId !== form_id)) &&
          'Создать'}
        {form_id > 0 &&
          loadingForm.form_id !== form_id &&
          (!error || (error && updatingFormId !== form_id)) &&
          (!isRequestSuccess || (isRequestSuccess && updatingFormId !== form_id)) &&
          'Сохранить'}
        {loadingForm.form_id === form_id && (
          <div>
            <ImSpinner9 className='inline text-white animate-spin mr-4' />
            <span>Обработка</span>
          </div>
        )}
        {loadingForm.form_id !== form_id && error && error.form_id === form_id && (
          <div>
            <ImCross className='mr-2 inline' />
            <span>Ошибка</span>
          </div>
        )}
        {loadingForm.form_id !== form_id && !error && isRequestSuccess && (
          <div>
            <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
            <span>Успешно</span>
          </div>
        )}
      </Button>
      <Button
        className='text-blue-700 bg-none border-blue-700'
        disabled={updatingFormId === form_id ? true : false}
        onClick={() => {
          prepareFormReadyForUpdateRequest();
        }}
        type='primary'
      >
        Править форму
      </Button>
      {!isFirstItem && (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryTextHover: '#fff',
                colorPrimaryHover: '#eb5e5e',
              },
            },
          }}
        >
          <Button
            type='primary'
            className='text-white bg-red-500 border-none'
            onClick={() => deleteCitizenPossession(form_id)}
          >
            Удалить форму
          </Button>
        </ConfigProvider>
      )}
    </div>
  );
};
