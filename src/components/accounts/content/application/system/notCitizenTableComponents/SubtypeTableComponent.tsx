import { FC, useState } from 'react';
import { IFilterAppOptions, ISubtype } from '../../../../../types';
import clsx from 'clsx';
import { Dropdown } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { ImSpinner9 } from 'react-icons/im';
import { getAllSubtypesWithExtraRequest } from '../../../../../../api/requests/Application';
import { useLogout } from '../../../../../hooks/useLogout';

interface IProps {
  name: any[];
  complexId: number | null;
  typeId: number | null;
  subtypeName: string | null;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterAppOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubtypeTableComponent: FC<IProps> = ({
  name,
  complexId,
  typeId,
  subtypeName,
  setFilterOptions,
  changeIsNeedToGet,
}) => {
  const logout = useLogout();
  const [isLoading, changeIsLoading] = useState(false);
  const [subtypesInSelect, setSubtypesInSelect] = useState<ISubtype[]>([]);

  const initSubtypesInFilter = async (complexId: number | null, typeId: number | null) => {
    changeIsLoading((prev) => !prev);
    let response = null;
    if (complexId && !typeId) {
      response = await getAllSubtypesWithExtraRequest(logout, undefined, complexId.toString());
    }
    if (!complexId && typeId) {
      response = await getAllSubtypesWithExtraRequest(logout, typeId.toString(), undefined);
    }
    if (complexId && typeId) {
      response = await getAllSubtypesWithExtraRequest(
        logout,
        typeId.toString(),
        complexId.toString(),
      );
    }
    if (!complexId && !typeId) {
      response = await getAllSubtypesWithExtraRequest(logout, undefined, undefined);
    }
    changeIsLoading((prev) => !prev);
    if (!response) return;
    setSubtypesInSelect(response);
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
          if (e && !subtypesInSelect.length) {
            initSubtypesInFilter(complexId, typeId);
          }
        }}
        overlayClassName='bg-black overflow-y-auto max-h-[150px] max-w-[200px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
        dropdownRender={() => (
          <div className='flex flex-col'>
            {!isLoading &&
              subtypesInSelect.map((el) => (
                <button
                  key={el.id}
                  className={clsx(
                    'transitionFast border-none p-2',
                    subtypeName === el.name
                      ? 'bg-gray-200 text-black'
                      : 'hover:bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, subtypeName: el.name }));
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
                  !subtypeName ? 'bg-white text-black' : 'hover:bg-black text-white',
                )}
                onClick={() => {
                  setFilterOptions((prev) => ({ ...prev, subtypeName: null }));
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
          className={clsx('text-lg cursor-pointer', subtypeName ? 'text-blue-700' : 'text-white')}
        />
      </Dropdown>
    </div>
  );
};
