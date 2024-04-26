import { useState, FC, useEffect } from 'react';
import { clsx } from 'clsx';
import { IApprovePossession, IBuildingWithComplex, IError } from '../../../types';
import { useLogout } from '../../../hooks/useLogout';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Complex } from './inputs/Complex';
import { PossessionType } from './inputs/PossessionType';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Buttons } from './button/Buttons';

interface IProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
}

const defaultPossessionInfo: IApprovePossession = {
  type: 1,
  complex: 0,
  building: 0,
  possession: '',
};

export const CreatePossession: FC<IProps> = ({
  needShowForm,
  changeNeedShowForm,
  getAllBuildingsByComplexId,
}) => {
  const [formData, changeFormData] = useState<IApprovePossession>(defaultPossessionInfo);
  const { user, isLoading } = useTypedSelector((state) => state.UserReducer);
  const [error, changeError] = useState<IError | null>(null);
  const { buildings, complexes } = useTypedSelector((state) => state.PossessionReducer);
  const logout = useLogout();
  const [needInitializeForm, changeNeedInitializeForm] = useState(true);

  const InitForm = async () => {
    if (!complexes.length || !needInitializeForm || !needShowForm) return;

    let builds: IBuildingWithComplex[] = [];
    if (!buildings.length) {
      const response = await getAllBuildingsByComplexId(complexes[0].id.toString());
      if (!response) return;
      else builds = response;
    } else builds = buildings;

    const complex = complexes.filter((el) => el.name === builds[0].complex)[0];
    changeFormData((prev) => ({
      ...prev,
      building: builds[0].id,
      complex: complex.id,
    }));
    changeNeedInitializeForm(false);
  };

  useEffect(() => {
    InitForm();
  }, [needShowForm]);

  const exitFromForm = () => {
    changeNeedShowForm(false);
    changeNeedInitializeForm(true);
    if (error) changeError(null);
    changeFormData(defaultPossessionInfo);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral h-screen fixed right-0 top-0 z-50 bg-blue-500 bg-opacity-10 backdrop-blur-xl flex justify-center items-center overflow-hidden',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div className='sm:min-w-[500px] sm:max-w-[500px] min-w-[250px] max-w-[250px] h-fit bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md p-5'>
        <div className='text-xl font-bold text-center mb-4'>
          Добавить недостающую жил. площадь в список вариантов выбора
        </div>
        <div className='flex flex-col gap-4'>
          <Complex
            complexes={complexes}
            getAllBuildingsByComplexId={getAllBuildingsByComplexId}
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
