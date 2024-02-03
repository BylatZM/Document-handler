import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Input, Select } from 'antd';

export const CitizenPossessions = () => {
  const { citizen } = useTypedSelector((state) => state.CitizenReducer);
  return (
    <>
      {citizen &&
        citizen.map((el) => {
          return (
            <div key={el.id} className='p-1'>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Лицевой счет</span>
                <Input value={el.personal_account} disabled />
              </div>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Тип имущества</span>
                <Select
                  className='w-full'
                  options={[
                    { label: 'квартира', value: 1 },
                    { label: 'офис', value: 2 },
                    { label: 'кладовка', value: 4 },
                    { label: 'парковка', value: 3 },
                  ]}
                  value={parseInt(el.possessionType)}
                  disabled
                />
              </div>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Статус собственника</span>
                <Select
                  className='w-full'
                  options={[
                    { label: 'арендодатор', value: 1 },
                    { label: 'гражданин', value: 2 },
                    { label: 'член семьи', value: 3 },
                    { label: 'ребенок', value: 4 },
                  ]}
                  disabled
                  value={parseInt(el.ownershipStatus)}
                />
              </div>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Название жилого комплекса</span>
                <Select
                  className='w-full'
                  disabled
                  value={el.complex.id}
                  options={[{ value: el.complex.id, label: el.complex.name }]}
                />
              </div>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Адрес здания</span>
                <Select
                  className='w-full'
                  disabled
                  value={el.building.id}
                  options={[{ value: el.building.id, label: el.building.address }]}
                />
              </div>
              <div className='mt-2 mb-2 text-sm'>
                <span className='font-bold'>Номер квартиры (номер собственности) </span>
                <Select
                  className='w-full'
                  disabled
                  value={el.possession.id}
                  options={[{ value: el.possession.id, label: el.possession.address }]}
                />
              </div>
              {parseInt(el.possessionType) === 3 && el.possession.car && (
                <>
                  <div className='mt-2 mb-2 text-sm'>
                    <span className='font-bold'>Марка автомобиля</span>
                    <Input disabled value={el.possession.car.car_brand} />
                  </div>
                  <div className='mt-2 mb-2 text-sm'>
                    <span className='font-bold'>Модель автомобиля</span>
                    <Input
                      disabled
                      value={el.possession.car.car_model ? el.possession.car.car_model : ''}
                    />
                  </div>
                  <div className='mt-2 text-sm'>
                    <span className='font-bold'>Гос. номер</span>
                    <Input
                      disabled
                      value={el.possession.car.state_number ? el.possession.car.state_number : ''}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
    </>
  );
};
