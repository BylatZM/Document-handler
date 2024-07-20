import { FC, useState } from 'react';
import { IFilterEmailAppOptions, IType } from '../../../../../types';
import clsx from 'clsx';
import { Dropdown } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { ImSpinner9 } from 'react-icons/im';
import { useLogout } from '../../../../../hooks/useLogout';
import {
  getAllTypesByComplexIdRequest,
  getAllTypesRequest,
} from '../../../../../../api/requests/Application';

interface IProps {
  name: any[];
  complexId: number | null;
  typeId: number | null;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterEmailAppOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TypeTableComponent: FC<IProps> = ({
  name,
  complexId,
  typeId,
  setFilterOptions,
  changeIsNeedToGet,
}) => {
  const logout = useLogout();
  const [isLoading, changeIsLoading] = useState(false);
  const [typesInSelect, setTypesInSelect] = useState<IType[]>([]);

  const getAllTypes = async () => {
    changeIsLoading((prev) => !prev);
    const response = await getAllTypesRequest(logout);
    changeIsLoading((prev) => !prev);
    if (!response) return;
    setTypesInSelect(response);
  };

  const getAllTypesByComplexId = async (complexId: number) => {
    changeIsLoading((prev) => !prev);
    const response = await getAllTypesByComplexIdRequest(complexId.toString(), logout);
    changeIsLoading((prev) => !prev);
    if (!response) return;
    setTypesInSelect(response);
  };

  const initTypeInFilter = async () => {
    if (complexId) {
      await getAllTypesByComplexId(complexId);
    } else {
      await getAllTypes();
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
          if (e && !typesInSelect.length) {
            initTypeInFilter();
          }
        }}
        overlayClassName='bg-black overflow-y-auto max-h-[150px] max-w-[200px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
        dropdownRender={() => (
          <div className='flex flex-col'>
            {!isLoading &&
              typesInSelect.map((el) => (
                <button
                  key={el.id}
                  className={clsx(
                    'transitionFast border-none p-2',
                    typeId === el.id ? 'bg-gray-200 text-black' : 'hover:bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, typeId: el.id, subtypeName: null }));
                    changeIsNeedToGet(true);
                  }}
                >
                  {el.name}
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
                  !typeId ? 'bg-white text-black' : 'hover:bg-black text-white',
                )}
                onClick={() => {
                  setFilterOptions((prev) => ({ ...prev, typeId: null }));
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
          className={clsx('text-lg cursor-pointer', typeId ? 'text-blue-700' : 'text-white')}
        />
      </Dropdown>
    </div>
  );
};
