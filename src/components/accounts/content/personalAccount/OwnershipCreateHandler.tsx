import { Button, Input, Popover, Select } from 'antd';
import { useState, FC } from 'react';
import { clsx } from 'clsx';
import { IApprovePossession, ICar, IError } from '../../../types';
import { createPossessionRequest, getBuildingsRequest } from '../../../../api/requests/Possession';
import { useLogout } from '../../../hooks/useLogout';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';

interface IProps {
  isFormActive: boolean;
  changeIsFormActive: (isFormActive: boolean) => void;
}

const defaultCar: ICar = {
  car_brand: '',
  car_model: null,
  state_number: null,
};

const defaultPossessionInfo: IApprovePossession = {
  type: 1,
  complex: 0,
  building: 0,
  possession: {
    address: '',
    car: null,
  },
};

export const OwnershipCreateHandler: FC<IProps> = ({ isFormActive, changeIsFormActive }) => {
  const [formData, changeFormData] = useState<IApprovePossession>(defaultPossessionInfo);
  const [error, changeError] = useState<IError | null>(null);
  const { building, complex } = useTypedSelector((state) => state.PossessionReducer);
  const { buildingSuccess } = useActions();
  const logout = useLogout();

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
  };

  const ConverterToString = (field: string | null): string => {
    if (!field) return '';

    return field;
  };

  const makeRequest = async () => {
    const { complex, ...info } = formData;
    const response = await createPossessionRequest(logout, info);

    if (!response) return;

    if (typeof response !== 'number' && 'type' in response) changeError(response);

    if (response === 201) {
      changeFormData(defaultPossessionInfo);
      changeIsFormActive(false);
    }
  };

  return (
    <div
      className={clsx(
        'transitionGeneral w-[500px] h-[600px] fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5',
        isFormActive ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
    >
      <div className='text-xl font-bold text-center mb-4'>Добавить собственность</div>
      <div className='flex flex-col gap-4'>
        <div className='text-sm'>
          <div>Жилищный комплекс</div>
          <Select
            className='w-full'
            value={!formData.complex ? undefined : formData.complex}
            onChange={(e: number) => {
              changeFormData((prev) => ({ ...prev, complex: e }));
              getBuildings(e.toString());
            }}
            options={!complex ? [] : complex.map((el) => ({ value: el.id, label: el.name }))}
          />
        </div>
        <div className='text-sm'>
          <span>Тип имущества</span>
          <Select
            className='w-full'
            options={[
              { label: 'квартира', value: 1 },
              { label: 'офис', value: 2 },
              { label: 'кладовка', value: 4 },
              { label: 'парковка', value: 3 },
            ]}
            value={formData.type}
            onChange={(e: number) =>
              changeFormData((prev) => ({
                ...prev,
                type: e,
                possession: {
                  ...prev.possession,
                  car: e === 3 ? defaultCar : null,
                },
              }))
            }
          />
        </div>
        <div className='text-sm'>
          <div>Адресс здания</div>
          <Select
            className='w-full'
            disabled={!formData.complex}
            value={!formData.building ? undefined : formData.building}
            onChange={(e: number) => changeFormData((prev) => ({ ...prev, building: e }))}
            options={!building ? [] : building.map((el) => ({ value: el.id, label: el.address }))}
          />
        </div>
        <div className='text-sm'>
          <div>Номер квартиры (номер собственности)</div>
          <Input
            maxLength={8}
            value={formData.possession.address}
            disabled={!formData.building}
            placeholder='34'
            onChange={(e) =>
              changeFormData((prev) => ({
                ...prev,
                possession: { ...prev.possession, address: e.target.value },
              }))
            }
          />
          {error && error.type === 'possession' && <div className='errorText'>{error.error}</div>}
        </div>
        {formData.possession.car && (
          <>
            <div className='text-sm'>
              <div>Марка автомобиля</div>
              <Input
                maxLength={25}
                value={!formData.possession.car ? '' : formData.possession.car.car_brand}
                disabled={!formData.building}
                placeholder='Audi'
                onChange={(e) =>
                  changeFormData((prev) => ({
                    ...prev,
                    possession: {
                      ...prev.possession,
                      car: !prev.possession.car
                        ? null
                        : { ...prev.possession.car, car_brand: e.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className='text-sm'>
              <div>Модель автомобиля</div>
              <Input
                maxLength={25}
                value={
                  !formData.possession.car
                    ? ''
                    : ConverterToString(formData.possession.car.car_model)
                }
                disabled={!formData.building}
                placeholder='A8'
                onChange={(e) =>
                  changeFormData((prev) => ({
                    ...prev,
                    possession: {
                      ...prev.possession,
                      car: !prev.possession.car
                        ? null
                        : { ...prev.possession.car, car_model: e.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className='text-sm'>
              <div>Гос. номер</div>
              <Input
                maxLength={25}
                value={
                  !formData.possession.car
                    ? ''
                    : ConverterToString(formData.possession.car.state_number)
                }
                disabled={!formData.building}
                placeholder='A001AA77RUS'
                onChange={(e) =>
                  changeFormData((prev) => ({
                    ...prev,
                    possession: {
                      ...prev.possession,
                      car: !prev.possession.car
                        ? null
                        : { ...prev.possession.car, state_number: e.target.value },
                    },
                  }))
                }
              />
              {error && error.type === 'state_number' && (
                <div className='errorText'>{error.error}</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className='absolute inset-x-0 bottom-0 flex justify-end gap-4 p-5'>
        <Button
          className='text-blue-700 bg-none border-blue-700'
          onClick={() => {
            changeFormData(defaultPossessionInfo);
            changeIsFormActive(false);
          }}
        >
          Закрыть
        </Button>
        <Popover content={'Заявка будет рассмотрена диспетчером'}>
          <Button
            type='primary'
            className=' text-white bg-blue-700'
            disabled={
              formData.building &&
              formData.complex &&
              formData.possession.address &&
              ((formData.type === 3 &&
                formData.possession.car &&
                formData.possession.car.car_brand &&
                formData.possession.car.state_number) ||
                formData.type !== 3)
                ? false
                : true
            }
            onClick={() => {
              makeRequest();
            }}
          >
            Отправить
          </Button>
        </Popover>
      </div>
    </div>
  );
};
