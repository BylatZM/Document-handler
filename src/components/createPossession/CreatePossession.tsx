import { useState, FC, useEffect } from 'react';
import { clsx } from 'clsx';
import { IApprovePossession, ICar, IError } from '../types';
import { getBuildingsRequest } from '../../api/requests/Possession';
import { useLogout } from '../hooks/useLogout';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useActions } from '../hooks/useActions';
import { Complex } from './inputs/Complex';
import { PossessionType } from './inputs/PossessionType';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Car } from './inputs/Car';
import { Buttons } from './button/Buttons';

interface IProps {
  isFormActive: boolean;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultCar: ICar = {
  car_brand: '',
  car_model: null,
  state_number: null,
};

const defaultPossessionInfo: IApprovePossession = {
  type: 1,
  complex: 1,
  building: 1,
  possession: {
    address: '',
    car: null,
  },
};

export const CreatePossession: FC<IProps> = ({ isFormActive, changeIsFormActive }) => {
  const [formData, changeFormData] = useState<IApprovePossession>(defaultPossessionInfo);
  const { user, isLoading } = useTypedSelector((state) => state.UserReducer);
  const [error, changeError] = useState<IError | null>(null);
  const { building, complex } = useTypedSelector((state) => state.PossessionReducer);
  const { buildingSuccess } = useActions();
  const logout = useLogout();

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
  };

  useEffect(() => {
    if (!complex) return;

    if (isFormActive) {
      buildingSuccess(null);
      getBuildings(complex[0].id.toString());
    }
  }, [isFormActive]);

  return (
    <div
      className={clsx(
        'transitionGeneral w-[500px] h-min fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5',
        isFormActive ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
    >
      <div className='text-xl font-bold text-center mb-4'>Добавить собственность</div>
      <div className='flex flex-col gap-4'>
        <Complex
          complexes={complex}
          getBuildings={getBuildings}
          data={formData}
          changeData={changeFormData}
        />
        <PossessionType data={formData} changeData={changeFormData} defaultCar={defaultCar} />
        <Building data={formData} changeData={changeFormData} buildings={building} />
        <Possession data={formData} changeData={changeFormData} error={error} />
        {formData.possession.car && (
          <Car data={formData} changeData={changeFormData} error={error} />
        )}
      </div>
      <Buttons
        data={formData}
        changeData={changeFormData}
        changeError={changeError}
        changeIsFormActive={changeIsFormActive}
        error={error}
        isLoading={isLoading}
        defaultPossessionInfo={defaultPossessionInfo}
        role={user.role.role}
        logout={logout}
      />
    </div>
  );
};
