import { FC } from 'react';
import { ICitizen, ICitizenLoading } from '../../../../../../types';
import { Button, ConfigProvider } from 'antd';
import { ImSpinner9 } from 'react-icons/im';
import { useActions } from '../../../../../../hooks/useActions';
import {
  createCitizenRequest,
  deleteCitizenRequest,
  updateCitizenRequest,
} from '../../../../../../../api/requests/Person';
import { useLogout } from '../../../../../../hooks/useLogout';

interface IProp {
  data: ICitizen;
  changeData: React.Dispatch<React.SetStateAction<ICitizen>>;
  isFirstItem: boolean;
  form_id: number;
  updatingFormId: number | null;
  loadingForm: ICitizenLoading;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  changeNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void>;
  getBuildings: (complex_id: string) => Promise<void>;
}

export const Buttons: FC<IProp> = ({
  data,
  changeData,
  isFirstItem,
  form_id,
  updatingFormId,
  loadingForm,
  changeUpdatingFormId,
  changeNeedUpdate,
  getPossessions,
  getBuildings,
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

  const createCitizen = async () => {
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
        changeUpdatingFormId(null);
        changeNeedUpdate(true);
      } else citizenErrors(response);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const updateCitizen = async () => {
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
        updateCitizenForm({
          form_id: form_id,
          citizen: data,
        });
        changeUpdatingFormId(null);
      } else citizenErrors(response);
    }

    citizenLoading({ form_id: 0, isLoading: false });
  };

  const deleteCitizen = async () => {
    deleteCitizenForm({ form_id: form_id });
    if (form_id > 0) await deleteCitizenRequest(form_id, logout);
  };

  return (
    <div className='flex gap-4'>
      <Button
        className='text-white bg-blue-700'
        disabled={
          !data.building.id ||
          !data.complex.id ||
          data.personal_account === '' ||
          !data.possession.id ||
          (form_id !== -1 && updatingFormId !== form_id)
        }
        onClick={() => {
          form_id < 1 ? createCitizen() : updateCitizen();
        }}
        type='primary'
      >
        {loadingForm.form_id !== form_id && 'Сохранить'}
        {loadingForm.form_id === form_id && (
          <div className='inline-flex items-center'>
            <ImSpinner9 className='text-white animate-spin mr-4' />
            <span>Обработка</span>
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
