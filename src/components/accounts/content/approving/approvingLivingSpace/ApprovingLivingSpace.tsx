import { useState } from 'react';
import {
  IFilterNotApprovedLivingSpacesOptions,
  INotApprovedLivingSpace,
  ITableParams,
} from '../../../../types';
import { AppTable } from './components/AppTable';
import { getAllNotApprovedPossessionsRequest } from '../../../../../api/requests/Possession';
import { useLogout } from '../../../../hooks/useLogout';
import { Main } from './components/Main';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

export const ApprovingLivingSpace = () => {
  const logout = useLogout();
  const { approvingLivingSpaces } = useTypedSelector((state) => state.ApprovingReducer);
  const [selectedPossession, changeSelectedPossession] = useState<INotApprovedLivingSpace | null>(
    null,
  );
  const page_size = localStorage.getItem('approving_living_possession_size');
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize:
        !page_size || (page_size && (isNaN(parseInt(page_size)) || parseInt(page_size) < 1))
          ? 10
          : parseInt(page_size),
      pageSizeOptions: [10, 15, 20, 25],
      showSizeChanger: true,
      locale: {
        items_per_page: 'заявок.',
      },
      position: ['topLeft'],
    },
  });
  const { approvingLoading, approvingLivingSpacesSuccess } = useActions();

  const getNotApprovedLivingSpaces = async (
    filterOptions?: IFilterNotApprovedLivingSpacesOptions,
  ) => {
    if (tableParams.pagination) {
      let application_size: string | null = localStorage.getItem(
        'approving_citizen_possession_size',
      );
      if (!application_size) {
        localStorage.setItem('approving_citizen_possession_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        size = 10;
        localStorage.setItem('approving_citizen_possession_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        size = tableParams.pagination.pageSize;
        localStorage.setItem(
          'approving_citizen_possession_size',
          tableParams.pagination.pageSize.toString(),
        );
      }
    }
    approvingLoading('approvingLivingSpaces');
    let extra = '';
    if (filterOptions) {
      localStorage.setItem('approving_living_space_filter_options', JSON.stringify(filterOptions));
      if (filterOptions.complexId) {
        extra += `&complex_id=${filterOptions.complexId}`;
      }
      if (filterOptions.buildingId) {
        extra += `&building_id=${filterOptions.buildingId}`;
      }
      if (filterOptions.creator) {
        extra += `&creator=${filterOptions.creator.trim().replaceAll(/\s\s/g, '')}`;
      }
      if (filterOptions.possessionType) {
        extra += `&possession_type_id=${filterOptions.possessionType}`;
      }
      if (filterOptions.possessionName) {
        extra += `&possession_name=${filterOptions.possessionName
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[^а-яА-Я\s0-9]/g, '')}`;
      }
      if (filterOptions.personalAccount) {
        extra += `&personal_account=${filterOptions.personalAccount
          .trim()
          .replaceAll(/[^0-9]/g, '')}`;
      }
      if (filterOptions.statusId) {
        extra += `&status_id=${filterOptions.statusId}`;
      }
    }
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getAllNotApprovedPossessionsRequest(logout, page, page_size, extra);
    approvingLoading(null);
    if (!response) return;
    if (
      (tableParams.pagination && !tableParams.pagination.total) ||
      (tableParams.pagination &&
        tableParams.pagination.total &&
        tableParams.pagination.total !== response.total)
    ) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    }
    approvingLivingSpacesSuccess(response.result);
  };

  return (
    <>
      <Main
        selectedPossession={selectedPossession}
        changeSelectedPossession={changeSelectedPossession}
      />
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-[22px]'>
          <span className='text-gray-400 text-sm'>Найдено: {approvingLivingSpaces.length}</span>
          <AppTable
            tableInfo={approvingLivingSpaces}
            tableParams={tableParams}
            setTableParams={setTableParams}
            getNotApprovedLivingSpaces={getNotApprovedLivingSpaces}
            changeSelectedPossession={changeSelectedPossession}
          />
        </div>
      </div>
    </>
  );
};
