import { FC, useState } from 'react';
import { IBuilding, IFilterNotApprovedLivingSpacesOptions } from '../../../../../types';
import clsx from 'clsx';
import { Dropdown } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { ImSpinner9 } from 'react-icons/im';
import {
  getAllBuildingsByComplexIdRequest,
  getAllBuildingsRequest,
} from '../../../../../../api/requests/Possession';
import { useLogout } from '../../../../../hooks/useLogout';

interface IProps {
  name: any[];
  complexId: number | null;
  buildingId: number | null;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterNotApprovedLivingSpacesOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BuildingTableComponent: FC<IProps> = ({
  name,
  complexId,
  buildingId,
  setFilterOptions,
  changeIsNeedToGet,
}) => {
  const logout = useLogout();
  const [isLoading, changeIsLoading] = useState(false);
  const [buildingsInSelect, setBuildingsInSelect] = useState<IBuilding[]>([]);

  const getAllBuildings = async () => {
    changeIsLoading((prev) => !prev);
    const response = await getAllBuildingsRequest(logout);
    changeIsLoading((prev) => !prev);
    if (!response) return;
    setBuildingsInSelect(response);
  };

  const getAllBuildingsByComplexId = async (complexId: number) => {
    changeIsLoading((prev) => !prev);
    const response = await getAllBuildingsByComplexIdRequest(complexId.toString(), logout);
    changeIsLoading((prev) => !prev);
    if (!response) return;
    setBuildingsInSelect(response);
  };

  const initBuildingsInFilter = async () => {
    if (complexId) {
      await getAllBuildingsByComplexId(complexId);
    } else {
      await getAllBuildings();
    }
  };

  return (
    <div className='flex gap-x-2 justify-center'>
      <span>{name}</span>
      <Dropdown
        trigger={['click']}
        arrow
        placement='bottom'
        align={{ offset: [0, 18] }}
        onOpenChange={(e) => {
          if (e && !buildingsInSelect.length) {
            initBuildingsInFilter();
          }
        }}
        overlayClassName='bg-black overflow-y-auto max-h-[150px] max-w-[200px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
        dropdownRender={() => (
          <div className='flex flex-col'>
            {!isLoading &&
              buildingsInSelect.map((el) => (
                <button
                  className={clsx(
                    'transitionFast border-none p-2',
                    buildingId === el.id ? 'bg-gray-200 text-black' : 'hover:bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, buildingId: el.id }));
                    changeIsNeedToGet(true);
                  }}
                >
                  {el.address}
                </button>
              ))}
            {isLoading && (
              <div className='w-full flex justify-center gap-x-2 p-2 bg-black text-white'>
                <span>Загрузка...</span>
                <ImSpinner9 className='animate-spin' />
              </div>
            )}
            {!isLoading && (
              <button
                className={clsx(
                  'transitionFast border-none p-2',
                  !buildingId ? 'bg-white text-black' : 'hover:bg-black text-white',
                )}
                onClick={() => {
                  setFilterOptions((prev) => ({ ...prev, buildingId: null }));
                  changeIsNeedToGet(true);
                }}
              >
                Все
              </button>
            )}
          </div>
        )}
      >
        <IoFunnel
          className={clsx('text-lg cursor-pointer', buildingId ? 'text-blue-700' : 'text-white')}
        />
      </Dropdown>
    </div>
  );
};
