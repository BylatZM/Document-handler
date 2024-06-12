import { useState, FC, useEffect } from 'react';
import { clsx } from 'clsx';
import { IApprovePossession, IBuilding, IError } from '../../../types';
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
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
}

const defaultPossessionInfo: IApprovePossession = {
  type: 1,
  complex: 0,
  building: 0,
  name: '',
};

export const CreatePossession: FC<IProps> = ({
  needShowForm,
  changeNeedShowForm,
  getAllBuildingsByComplexId,
}) => {
  const [formData, changeFormData] = useState<IApprovePossession>(defaultPossessionInfo);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const [error, changeError] = useState<IError | null>(null);
  const { buildings, complexes } = useTypedSelector((state) => state.PossessionReducer);
  const logout = useLogout();
  const [needInitializeForm, changeNeedInitializeForm] = useState(true);

  const InitForm = async () => {
    if (!complexes.length || !needInitializeForm || !needShowForm) return;

    let builds: IBuilding[] = [];
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
      <div className='sm:min-w-[500px] sm:max-w-[500px] min-w-[250px] max-w-[250px] h-fit bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md p-4 max-sm:p-2'>
        <div className='text-xl font-bold text-center mb-4 max-sm:mb-2'>Добавить жилую площадь</div>
        <div className='flex flex-col gap-4 max-sm:gap-2'>
          <Complex
            complexes={complexes}
            getAllBuildingsByComplexId={getAllBuildingsByComplexId}
            data={formData}
            changeData={changeFormData}
          />
          <PossessionType data={formData} changeData={changeFormData} />
          <Building data={formData} changeData={changeFormData} buildings={buildings} />
          <Possession
            data={formData}
            changeData={changeFormData}
            error={error}
            changeError={changeError}
          />
        </div>
        {user.role === 'citizen' && (
          <div className='text-left mt-4 max-sm:mt-2 text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50 '>
            <span className='text-red-500'>Внимание! </span>На данной форме вы можете добавить
            недостающую жилую площадь в список вариантов выбора. После успешного создания записи,
            вам нужно дождаться ее подтверждения со стороны диспетчера.
          </div>
        )}
        <Buttons
          data={formData}
          changeError={changeError}
          error={error}
          role={user.role}
          logout={logout}
          exitFromForm={exitFromForm}
        />
      </div>
    </div>
  );
};
