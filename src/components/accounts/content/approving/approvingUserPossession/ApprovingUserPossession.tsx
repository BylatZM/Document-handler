import { useState } from 'react';
import {
  IFilterNotApprovedCitizenPossessionOptions,
  INotApprovedCitizenPossession,
  ISortNotApprovedCitizenPossessionOptions,
  ITableParams,
} from '../../../../types';
import { AppTable } from './components/AppTable';
import { getNotApprovedCitizenPossessionsRequest } from '../../../../../api/requests/User';
import { useLogout } from '../../../../hooks/useLogout';
import { Main } from './components/Main';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

export const ApprovingUserPossession = () => {
  const [selectedCitizenPossession, changeSelectedCitizenPossession] =
    useState<INotApprovedCitizenPossession | null>(null);
  const logout = useLogout();
  const { approvingCitizenPossessions } = useTypedSelector((state) => state.ApprovingReducer);
  const page_size = localStorage.getItem('approving_citizen_possession_size');
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
  const { approvingLoading, approvingCitizenPossessionsSuccess } = useActions();

  const getNotApprovedCitizenPossessions = async (
    filterOptions?: IFilterNotApprovedCitizenPossessionOptions,
    sortOptions?: ISortNotApprovedCitizenPossessionOptions,
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
    approvingLoading('approvingCitizenPossessions');
    let extra = '';
    if (filterOptions) {
      localStorage.setItem(
        'approving_citizen_possession_filter_options',
        JSON.stringify(filterOptions),
      );
      if (filterOptions.complexId) {
        extra += `&complex_id=${filterOptions.complexId}`;
      }
      if (filterOptions.buildingId) {
        extra += `&building_id=${filterOptions.buildingId}`;
      }
      if (filterOptions.fio) {
        extra += `&citizen_fio=${filterOptions.fio
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[^а-яА-Я\s]/g, '')}`;
      }
      if (filterOptions.possessionType) {
        extra += `&possession_type=${filterOptions.possessionType}`;
      }
      if (filterOptions.possessionName) {
        extra += `&possession_name=${filterOptions.possessionName
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[^а-яА-Я\s0-9]/g, '')}`;
      }
      if (filterOptions.statusId) {
        extra += `&status_id=${filterOptions.statusId}`;
      }
    }
    if (sortOptions) {
      localStorage.setItem(
        'approving_citizen_possession_sort_options',
        JSON.stringify(sortOptions),
      );
      if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc)
        extra += '&created_date=dec';
      if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc)
        extra += '&created_date=inc';
    }
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getNotApprovedCitizenPossessionsRequest(page, page_size, extra, logout);
    if (response) {
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
      approvingCitizenPossessionsSuccess(response.result);
    } else approvingLoading(null);
  };

  return (
    <>
      <Main
        selectedCitizenPossession={selectedCitizenPossession}
        changeSelectedCitizenPossession={changeSelectedCitizenPossession}
      />
      <div className='mt-[98px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-[22px] sm:mt-0'>
          <span className='text-gray-400 text-sm'>
            Найдено: {approvingCitizenPossessions.length}
          </span>
          <AppTable
            changeSelectedCitizenPossession={changeSelectedCitizenPossession}
            tableParams={tableParams}
            setTableParams={setTableParams}
            getNotApprovedCitizenPossessions={getNotApprovedCitizenPossessions}
          />
        </div>
      </div>
    </>
  );
};
