import { useState, FC, useEffect } from 'react';
import { clsx } from 'clsx';
import { IApprovePossession, IError } from '../../../types';
import { getBuildingsRequest } from '../../../../api/requests/Possession';
import { useLogout } from '../../../hooks/useLogout';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { Complex } from './inputs/Complex';
import { PossessionType } from './inputs/PossessionType';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Buttons } from './button/Buttons';

interface IProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultPossessionInfo: IApprovePossession = {
  type: 1,
  complex: 0,
  building: 0,
  possession: '',
};

export const CreatePossession: FC<IProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [formData, changeFormData] = useState<IApprovePossession>(defaultPossessionInfo);
  const { user, isLoading } = useTypedSelector((state) => state.UserReducer);
  const [error, changeError] = useState<IError | null>(null);
  const { buildings, complexes } = useTypedSelector((state) => state.PossessionReducer);
  const { buildingSuccess } = useActions();
  const logout = useLogout();
  const [needInitializeForm, changeNeedInitializeForm] = useState(true);

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
  };

  useEffect(() => {
    if (!complexes.length || !needInitializeForm || !needShowForm) return;

    if (!buildings.length) {
      getBuildings(complexes[0].id.toString());
    } else {
      const complex = complexes.filter((el) => el.name === buildings[0].complex)[0];
      changeFormData((prev) => ({
        ...prev,
        building: buildings[0].id,
        complex: complex.id,
      }));
      changeNeedInitializeForm(false);
    }
  }, [needShowForm, buildings]);

  const exitFromForm = () => {
    changeNeedShowForm(false);
    changeNeedInitializeForm(true);
    if (error) changeError(null);
    changeFormData(defaultPossessionInfo);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral h-screen fixed right-0 top-0 z-30 bg-blue-500 bg-opacity-10 backdrop-blur-xl flex justify-center items-center overflow-hidden',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div className='sm:min-w-[500px] sm:max-w-[500px] min-w-[250px] max-w-[250px] h-fit bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md p-5'>
        <div className='text-xl font-bold text-center mb-4'>Добавить собственность</div>
        <div className='flex flex-col gap-4'>
          <Complex
            complexes={complexes}
            getBuildings={getBuildings}
            data={formData}
            changeData={changeFormData}
          />
          <PossessionType data={formData} changeData={changeFormData} />
          <Building data={formData} changeData={changeFormData} buildings={buildings} />
          <Possession data={formData} changeData={changeFormData} error={error} />
        </div>
        <Buttons
          data={formData}
          changeError={changeError}
          error={error}
          isLoading={isLoading}
          role={user.role}
          logout={logout}
          exitFromForm={exitFromForm}
        />
      </div>
    </div>
  );
};
