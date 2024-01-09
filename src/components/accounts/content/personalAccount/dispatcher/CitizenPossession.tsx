import { Button, Carousel, Input, Select } from 'antd';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import clsx from 'clsx';
import { GrNext } from 'react-icons/gr';
import { FC, useRef } from 'react';

interface CitizenPossessionProps {
  isFormActive: boolean;
  changeIsFormActive: (isFormActive: boolean) => void;
}

export const CitizenPossession: FC<CitizenPossessionProps> = ({
  isFormActive,
  changeIsFormActive,
}) => {
  const { isLoading, citizen } = useTypedSelector((state) => state.CitizenReducer);
  const CarouselMethods = useRef<any>(null);

  return (
    <div
      className={clsx(
        'transitionGeneral fixed inset-0 overflow-hidden min-h-screen bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20] flex justify-center items-center',
        isFormActive ? 'w-full' : 'w-0',
      )}
    >
      <div className='flex inset-0 m-auto'>
        {citizen && citizen.length > 1 && (
          <button className='bg-none' onClick={() => CarouselMethods.current.prev()}>
            <GrNext className='text-3xl rotate-180 hover:scale-150' />
          </button>
        )}
        <div
          className={clsx(
            'transitionGeneral flex flex-col justify-between rounded-md bg-blue-700 p-[20px] bg-opacity-10 backdrop-blur-xl w-[600px] h-[500px] border-solid border-blue-500 border-[1px]',
            !isLoading?.isLoading ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className='font-bold text-2xl mb-2'>Собственности жителя</span>
          <Carousel
            autoplay={false}
            dots={false}
            ref={CarouselMethods}
            className='overflow-y-auto w-[558px] h-[370px]'
          >
            {citizen &&
              citizen.map((el) => {
                return (
                  <div key={el.id}>
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
                        value={parseInt(el.ownershipType)}
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
                      <span className='font-bold'>Название жилищьного комплекса</span>
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
                    {parseInt(el.ownershipType) === 3 && el.possession.car && (
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
                            value={
                              el.possession.car.state_number ? el.possession.car.state_number : ''
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </Carousel>
          <div className='flex w-full justify-end'>
            <Button
              className='border-[1px] border-blue-700 text-blue-700 h-[40px]'
              onClick={() => changeIsFormActive(false)}
            >
              Закрыть
            </Button>
          </div>
        </div>
        {citizen && citizen.length > 1 && (
          <button className='bg-none' onClick={() => CarouselMethods.current.next()}>
            <GrNext className='text-3xl hover:scale-150' />
          </button>
        )}
      </div>
    </div>
  );
};
