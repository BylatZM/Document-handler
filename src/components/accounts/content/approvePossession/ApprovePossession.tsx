import { useEffect, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { INotApprovedPossessions } from '../../../types';
import { AppTable } from './AppTable';
import { Select } from 'antd';

type ISelection = 1 | 2 | 3;

export const ApprovePossession = () => {
  const { notApprovedPossessions } = useTypedSelector((state) => state.PossessionReducer);
  const [filtratedItems, changeFiltratedItems] = useState<INotApprovedPossessions[] | null>(null);
  const [filterType, changeFilterType] = useState<ISelection>(3);

  useEffect(() => {
    if (!notApprovedPossessions) return;

    if (filterType === 1)
      changeFiltratedItems(notApprovedPossessions.filter((el) => el.approving_status === 'новая'));
    if (filterType === 2)
      changeFiltratedItems(
        notApprovedPossessions.filter((el) => el.approving_status === 'отклонена'),
      );
    if (filterType === 3) changeFiltratedItems(notApprovedPossessions);
  }, [filterType, notApprovedPossessions]);

  return (
    <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-28 sm:mt-0'>
      <div className='flex justify-between'>
        <div className='flex items-center gap-4'>
          <span className='text-gray-400 text-sm'>
            Найдено: {!notApprovedPossessions ? 0 : notApprovedPossessions.length}
          </span>
          <div>
            <span className='text-gray-400 text-sm'>Фильтрация по статусам заявок: </span>
            <Select
              className='w-[140px] inline-block'
              placeholder='Фильтрация по статусам заявок'
              value={filterType}
              options={[
                { value: 1, label: 'новые' },
                { value: 2, label: 'отклоненные' },
                { value: 3, label: 'все' },
              ]}
              onChange={(e: ISelection) => changeFilterType(e)}
            />
          </div>
        </div>
      </div>
      <AppTable tableItems={filtratedItems} />
    </div>
  );
};
