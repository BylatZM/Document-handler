import { FC, useState } from 'react';
import { ICitizen, ICitizenLoading } from '../../../../../../types';
import { Button, ConfigProvider } from 'antd';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { useActions } from '../../../../../../hooks/useActions';
import {
  createCitizenRequest,
  deleteCitizenRequest,
  updateCitizenRequest,
} from '../../../../../../../api/requests/Person';
import { useLogout } from '../../../../../../hooks/useLogout';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import clsx from 'clsx';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProp {
  data: ICitizen;
  isFirstItem: boolean;
  form_id: number;
  updatingFormId: number | null;
  loadingForm: ICitizenLoading;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  changeNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void>;
  getBuildings: (complex_id: string) => Promise<void>;
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons: FC<IProp> = ({
  data,
  isFirstItem,
  form_id,
  updatingFormId,
  loadingForm,
  changeUpdatingFormId,
  changeNeedUpdate,
  getPossessions,
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
  const { user } = useTypedSelector((state) => state.UserReducer);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);

  const createCitizen = async () => {
    if (error && error.form_id === form_id) citizenErrors(null);
    citizenLoading({ form_id: form_id, isLoading: true });

    const response = await createCitizenRequest(form_id, logout, {
      personal_account: data.personal_account,
      ownershipStatus: data.ownershipStatus,
      possessionType: data.possessionType,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
    });
    if (response) {
      if (response === 201) {
        if (user.account_status === 'новый' && user.first_name && user.last_name && user.phone)
          changeNeedShowNotification(true);
        changeUpdatingFormId(null);
        changeNeedUpdate(true);
      } else citizenErrors(response);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const updateCitizen = async () => {
    if (error && error.form_id === form_id) citizenErrors(null);
    citizenLoading({ form_id: form_id, isLoading: true });
    const response = await updateCitizenRequest(form_id, logout, {
      personal_account: data.personal_account,
      ownershipStatus: data.ownershipStatus,
      possessionType: data.possessionType,
      complex: data.complex.id,
      building: data.building.id,
      possession: data.possession.id,
    });

    if (response) {
      if (response === 200) {
        changeIsRequestSuccess((prev) => !prev);
        updateCitizenForm({
          form_id: form_id,
          citizen: data,
        });
        setTimeout(() => {
          changeUpdatingFormId(null);
          changeIsRequestSuccess((prev) => !prev);
        }, 2000);
      } else citizenErrors(response);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const deleteCitizen = async () => {
    deleteCitizenForm({ form_id: form_id });
    if (form_id > 0) await deleteCitizenRequest(form_id, logout);
  };

  return (
    <div className='flex max-sm:gap-y-2 max-sm:flex-col max-sm:gap-x-0 gap-4'>
      <Button
        className={clsx(
          'text-white',
          !error && !isRequestSuccess && 'bg-blue-700',
          error && !isRequestSuccess && !loadingForm.form_id && 'bg-red-500',
          !error && isRequestSuccess && !loadingForm.form_id && 'bg-green-500',
        )}
        disabled={
          !data.building.id ||
          !data.complex.id ||
          data.personal_account === '' ||
          !data.possession.id ||
          (form_id !== -1 && updatingFormId !== form_id)
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
          form_id < 1 ? createCitizen() : updateCitizen();
        }}
        type='primary'
      >
        {form_id < 1 && loadingForm.form_id !== form_id && !error && !isRequestSuccess && 'Создать'}
        {form_id > 0 &&
          loadingForm.form_id !== form_id &&
          !error &&
          !isRequestSuccess &&
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
          buildingSuccess(null);
          possessionSuccess(null);
          if (data.complex.id) getBuildings(data.complex.id.toString());
          if (data.possessionType && data.building.id)
            getPossessions(data.possessionType, data.building.id.toString());
          changeUpdatingFormId(form_id);
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
            onClick={() => deleteCitizen()}
          >
            Удалить форму
          </Button>
        </ConfigProvider>
      )}
    </div>
  );
};
