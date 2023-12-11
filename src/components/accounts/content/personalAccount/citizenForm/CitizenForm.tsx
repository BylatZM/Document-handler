import { Input, Button, Select, ConfigProvider } from 'antd';
import { FC, useState, useEffect } from 'react';
import { ICitizen } from '../../../../types';
import { useActions } from '../../../../hooks/useActions';
import { ImSpinner9 } from 'react-icons/im';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import {
  createCitizenRequest,
  deleteCitizenRequest,
  updateCitizenRequest,
} from '../../../../../store/creators/PersonCreators';
import {
  getBuildingsRequest,
  getPossessionsRequest,
} from '../../../../../store/creators/PossessionCreators';

interface ICitizenFormProps {
  data: {
    key: number;
    info: ICitizen;
    isFirstItem: boolean;
    isNew: boolean;
  };
  changeNeedUpdate: (needUpdate: boolean) => void;
}

export const CitizenForm: FC<ICitizenFormProps> = ({ data, changeNeedUpdate }) => {
  const {
    citizenStart,
    citizenErrors,
    updateCitizenForm,
    deleteCitizenForm,
    possessionSuccess,
    buildingSuccess,
  } = useActions();
  const { isLoading, error } = useTypedSelector((state) => state.CitizenReducer);
  const isLoadingPossession = useTypedSelector((state) => state.PossessionReducer.isLoading);
  const { complex, building, possession } = useTypedSelector((state) => state.PossessionReducer);
  const [formData, changeFormData] = useState<ICitizen>(data.info);

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id);
    if (response !== 403) {
      buildingSuccess(response);
    }
  };

  const getPossessions = async (type: string, building_id: string) => {
    const response = await getPossessionsRequest(data.key, type, building_id);
    if (response !== 403) {
      if ('form_id' in response) {
        possessionSuccess(null);
        citizenErrors(response);
      } else possessionSuccess(response);
    }
  };

  useEffect(() => {
    if (!data.isNew) {
      getBuildings(formData.complex.id.toString());
      getPossessions(formData.ownershipType, formData.building.id.toString());
    }
  }, []);

  const createCitizen = async () => {
    citizenStart({ form_id: data.key });

    const response = await createCitizenRequest(data.key, {
      personal_account: formData.personal_account,
      ownershipStatus: formData.ownershipStatus,
      ownershipType: formData.ownershipType,
      complex: formData.complex.id,
      building: formData.building.id,
      possession: formData.possession.id,
    });
    if (response === 201) changeNeedUpdate(true);
    else if (response !== 403 && 'form_id' in response) {
      citizenErrors(response);
    }
  };

  const updateCitizen = async () => {
    citizenStart({ form_id: data.key });
    const response = await updateCitizenRequest(data.key, {
      personal_account: formData.personal_account,
      ownershipStatus: formData.ownershipStatus,
      ownershipType: formData.ownershipType,
      complex: formData.complex.id,
      building: formData.building.id,
      possession: formData.possession.id,
    });

    if (response === 200) {
      updateCitizenForm({
        form_id: data.key,
        citizen: formData,
      });
    } else if (response !== 403) citizenErrors(response);
  };

  const deleteCitizen = async () => {
    deleteCitizenForm({ form_id: data.key });
    if (data.key > 0) await deleteCitizenRequest(data.key);
  };

  return (
    <>
      <div className='mt-2 mb-2 text-sm'>
        <span>Лицевой счет</span>
        <Input
          value={formData.personal_account}
          maxLength={15}
          disabled={isLoading && isLoading.form_id === data.key ? isLoading.isLoading : false}
          onChange={(e) =>
            changeFormData((prev) => ({ ...prev, personal_account: e.target.value }))
          }
        />
        {error && error.form_id === data.key && error.error.type === 'personal_account' && (
          <div className='errorText'>{error.error.error}</div>
        )}
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Тип имущества</span>
        <Select
          className='w-full'
          options={[
            { label: 'квартира', value: 1 },
            { label: 'офис', value: 2 },
            { label: 'кладовка', value: 4 },
            { label: 'парковка', value: 3 },
          ]}
          value={parseInt(formData.ownershipType)}
          disabled={isLoading && isLoading.form_id === data.key ? isLoading.isLoading : false}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              ownershipType: e.toString(),
              possession: { id: 0, address: '', car: null },
            }));
            if (formData.building.id) {
              getPossessions(e.toString(), formData.building.id.toString());
            }
          }}
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Статус собственника</span>
        <Select
          className='w-full'
          options={[
            { label: 'арендодатор', value: 1 },
            { label: 'гражданин', value: 2 },
            { label: 'член семьи', value: 3 },
            { label: 'ребенок', value: 4 },
          ]}
          disabled={isLoading && isLoading.form_id === data.key ? true : false}
          value={parseInt(formData.ownershipStatus)}
          onChange={(e: number) => {
            changeFormData((prev) => ({
              ...prev,
              ownershipStatus: e.toString(),
              possession: { id: 0, address: '', car: null },
            }));
            if (formData.building.id) getPossessions(e.toString(), formData.building.id.toString());
          }}
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Название жилищьного комплекса</span>
        <Select
          className='w-full'
          disabled={
            (isLoading && isLoading.form_id === data.key) ||
            !complex ||
            isLoadingPossession === 'complex'
              ? true
              : false
          }
          value={!formData.complex.id ? undefined : formData.complex.id}
          options={!complex ? [] : complex.map((el) => ({ value: el.id, label: el.name }))}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              complex: { id: e, name: '' },
              building: { id: 0, address: '' },
              possession: { id: 0, address: '', car: null },
            }));
            getBuildings(e.toString());
          }}
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Адрес здания</span>
        <Select
          className='w-full'
          disabled={
            (isLoading && isLoading.form_id === data.key) ||
            !formData.complex.id ||
            isLoadingPossession === 'building'
              ? true
              : false
          }
          value={!formData.building.id ? undefined : formData.building.id}
          options={!building ? [] : building.map((el) => ({ value: el.id, label: el.address }))}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              building: { id: e, address: '' },
              possession: { id: 0, address: '', car: null },
            }));
            getPossessions(formData.ownershipType, e.toString());
          }}
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Номер квартиры (номер собственности) </span>
        <Select
          className='w-full'
          disabled={
            (isLoading && isLoading.form_id === data.key) || !formData.building.id || !possession
              ? true
              : false
          }
          value={!formData.possession.id ? undefined : formData.possession.id}
          options={!possession ? [] : possession.map((el) => ({ value: el.id, label: el.address }))}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              possession: {
                id: e,
                address: '',
                car:
                  possession && possession.filter((el) => el.id === e)[0].car
                    ? possession.filter((el) => el.id === e)[0].car
                    : null,
              },
            }));
          }}
        />
        {error && error.form_id === data.key && error.error.type === 'possession' && (
          <div className='errorText'>{error.error.error}</div>
        )}
      </div>
      {parseInt(formData.ownershipType) === 3 && formData.possession.id !== 0 && (
        <>
          <div className='mt-2 mb-2 text-sm'>
            <span>Марка автомобиля</span>
            <Input
              disabled={true}
              value={!formData.possession.car ? '' : formData.possession.car.car_brand}
            />
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Модель автомобиля</span>
            <Input
              disabled={true}
              value={
                formData.possession.car && formData.possession.car.car_model
                  ? formData.possession.car.car_model
                  : ''
              }
            />
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Гос. номер</span>
            <Input
              disabled={true}
              value={
                formData.possession.car && formData.possession.car.car_model
                  ? formData.possession.car.car_model
                  : ''
              }
            />
          </div>
        </>
      )}
      <div className='flex gap-4'>
        <Button
          className='text-white bg-blue-700'
          disabled={
            !formData.building.id ||
            !formData.complex.id ||
            formData.personal_account === '' ||
            !formData.possession.id
          }
          onClick={() => {
            data.key < 1 ? createCitizen() : updateCitizen();
          }}
          type='primary'
        >
          {(isLoading === null || (isLoading !== null && isLoading.form_id !== data.key)) &&
            'Сохранить'}
          {isLoading !== null && isLoading.form_id === data.key && (
            <div className='inline-flex items-center'>
              <ImSpinner9 className='text-white animate-spin mr-4' />
              <span>Обработка</span>
            </div>
          )}
        </Button>
        {!data.isFirstItem && (
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
    </>
  );
};
