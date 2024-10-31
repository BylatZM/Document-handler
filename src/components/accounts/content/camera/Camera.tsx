import { clsx } from 'clsx';
import { Video } from './components/Video';
import { useState, FC, useEffect } from 'react';
import { Player } from './components/Player';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Select } from 'antd';
import { IBuilding, ICamera, ICitizenPossession, IComplex, IError } from '../../../types';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { useLogout } from '../../../hooks/useLogout';
import { getAllCameraByBuildingIdRequest } from '../../../../api/requests/Camera';

interface IProps {
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  getCitizenPossessions: () => Promise<ICitizenPossession[] | void>;
}

export const Camera: FC<IProps> = ({ getAllBuildingsByComplexId, getCitizenPossessions }) => {
  const logout = useLogout();
  const [selectedCamUrl, changeSelectedCamUrl] = useState<string | null>(null);
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { role, is_approved } = useTypedSelector((state) => state.UserReducer.user);
  const [complexes, setComplexes] = useState<IComplex[]>([]);
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [selectedComplex, setSelectedComplex] = useState<number | undefined>(undefined);
  const [selectedBuilding, setSelectedBuilding] = useState<number | undefined>(undefined);
  const [isBlocked, setIsBlocked] = useState(true);
  const [cameras, setCameras] = useState<ICamera[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError | null>(null);
  const reducerComplexes = useTypedSelector((state) => state.PossessionReducer.complexes);
  const isBuildingLoading = useTypedSelector((state) => state.PossessionReducer.isLoading);

  const getCitizenComplexes = (poss: ICitizenPossession[]): IComplex[] => {
    return poss.filter((el) => el.approving_status === 'Подтверждена').map((el) => el.complex);
  };

  const citizenPossessionCheckOnApproving = async () => {
    setIsLoading((prev) => !prev);
    const response = await getCitizenPossessions();
    if (!response) {
      setError({
        type: 'possession',
        error:
          'Чтобы иметь возможность просматривать видео с камер, вам нужно зарегистрировать собственность в жилищном комплексе',
      });
      setIsLoading((prev) => !prev);
      return;
    }
    const comp: IComplex[] = getCitizenComplexes(response);
    if (!comp.length) {
      setIsLoading((prev) => !prev);
      setError({
        type: 'possession',
        error:
          'Чтобы иметь возможность просматривать видео с камер, вам нужно зарегистрировать собственность в жилищном комплексе',
      });
      return;
    }
    setComplexes(comp);
    setIsLoading((prev) => !prev);
    setIsBlocked(false);
  };

  const getAllCamerasByBuildingId = async (building_id: string) => {
    setIsLoading((prev) => !prev);
    const response = await getAllCameraByBuildingIdRequest(building_id, logout);
    setIsLoading((prev) => !prev);
    if (!response) {
      return;
    }
    if ('type' in response) {
      setError(response);
    } else {
      setCameras(response);
    }
  };

  const changeComplex = async (complex_id: number) => {
    if (error) setError(null);
    if (cameras.length) setCameras([]);
    setSelectedComplex(complex_id);
    setSelectedBuilding(undefined);
    const response = await getAllBuildingsByComplexId(complex_id.toString());
    if (!response) return;
    setBuildings(response);
  };

  const changeBuilding = async (building_id: number) => {
    if (error) setError(null);
    if (cameras.length) setCameras([]);
    setSelectedBuilding(building_id);
    await getAllCamerasByBuildingId(building_id.toString());
  };

  useEffect(() => {
    if (['dispatcher', 'executor'].some((el) => el === role)) {
      setIsBlocked(false);
      setComplexes(reducerComplexes);
    }
    if (role === 'citizen') {
      const comp = getCitizenComplexes(citizenPossessions);
      if (comp.length !== 0) {
        setIsBlocked(false);
        setComplexes(comp);
      } else {
        citizenPossessionCheckOnApproving();
      }
    }
  }, []);

  return (
    <>
      {!isBlocked && (
        <Player selectedCamUrl={selectedCamUrl} changeSelectedCamUrl={changeSelectedCamUrl} />
      )}
      <div className={clsx('fixed inset-0 overflow-y-auto mt-[68px] max-sm:mt-[106px] sm:p-5')}>
        {!isBlocked && (
          <div className='flex gap-y-2 flex-col w-full h-min'>
            <div className='flex flex-col'>
              <span>Жилищный комплекс</span>
              <Select
                className='max-sm:h-[30px] h-[40px] md:w-1/2 max-md:w-full md:max-w-[500px]'
                disabled={isLoading}
                value={selectedComplex}
                onChange={changeComplex}
                options={complexes.map((el) => ({ label: el.name, value: el.id }))}
              />
            </div>
            <div className='flex flex-col'>
              <span>Адрес здания</span>
              <Select
                className='max-sm:h-[30px] h-[40px] md:w-1/2 max-md:w-full md:max-w-[500px]'
                loading={isBuildingLoading === 'buildings'}
                disabled={
                  !selectedComplex ||
                  !buildings.length ||
                  isBuildingLoading === 'buildings' ||
                  isLoading
                    ? true
                    : false
                }
                value={selectedBuilding}
                onChange={changeBuilding}
                options={buildings.map((el) => ({ label: el.address, value: el.id }))}
              />
            </div>
          </div>
        )}
        {!isBlocked && cameras.length !== 0 && !isLoading && (
          <div className='flex flex-wrap gap-3 mt-[10%]'>
            {cameras.map((el) => (
              <Video
                key={el.id}
                changeSelectedCamUrl={changeSelectedCamUrl}
                description={el.description}
                preview={el.preview}
                camera={el.url}
              />
            ))}
          </div>
        )}
        {isLoading && (
          <div className='flex w-full gap-x-4 h-full items-center justify-center text-blue-700'>
            <AiOutlineLoading className='animate-spin text-5xl' />
            <span className='text-xl'>Загрузка</span>
          </div>
        )}
        {error && (
          <div className='flex w-full h-full gap-y-2 items-center justify-center flex-col text-red-700 text-center'>
            <BiError className='text-5xl' />
            <span className='text-xl'>{error.error}</span>
          </div>
        )}
      </div>
    </>
  );
};
