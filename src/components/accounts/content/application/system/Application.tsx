import { Button } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType } from 'antd/es/table';
import {
  IApplication,
  IApplicationCitizenColumns,
  IApplicationNotCitizenColumns,
  ITableParams,
  ISortOptions,
  IPossession,
  IBuilding,
  ISubtype,
  IError,
  IEmployee,
  IType,
  ICitizenPossession,
  IFilterAppOptions,
} from '../../../../types';
import { defaultCitizenColumns, defaultNotCitizenColumns } from './ApplicationTableArgs';
import { FC, useEffect, useState } from 'react';
import { CitizenTable } from './appTable/CitizenTable';
import { NotCitizenTable } from './appTable/NotCitizenTable';
import { CitizenColumnsForm } from './changeTableColumnsForms/CitizenColumnsForm';
import { NotCitizenColumnsForm } from './changeTableColumnsForms/NotCitizenColumnsForm';
import { useActions } from '../../../../hooks/useActions';
import { getAllSystemApplicationsByExtraRequest } from '../../../../../api/requests/Application';
import { useLogout } from '../../../../hooks/useLogout';
import { defaultAppForm } from './appForm/defaultAppForm';

interface IProps {
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  getTypesByComplexId: (complex_id: string) => Promise<IType[] | void>;
  getPriorities: () => Promise<void>;
  getSources: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  getCitizenPossessions: () => Promise<ICitizenPossession[] | void>;
}

export const Application: FC<IProps> = ({
  getPossessions,
  getAllBuildingsByComplexId,
  getPriorities,
  getSources,
  getStatuses,
  getSubtypes,
  getTypesByComplexId,
  getEmploys,
  getCitizenPossessions,
}) => {
  const { applications, priorities, statuses, sources } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const [selectedItem, changeSelectedItem] = useState<IApplication | null>(null);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [citizenTable, changeCitizenTable] =
    useState<null | ColumnsType<IApplicationCitizenColumns>>(null);
  const [notCitizenTable, changeNotCitizenTable] =
    useState<null | ColumnsType<IApplicationNotCitizenColumns>>(null);
  const { applicationLoading, applicationSuccess } = useActions();
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const page_size = localStorage.getItem('application_size');
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
  const logout = useLogout();

  const getApplications = async (filterOptions?: IFilterAppOptions, sortOptions?: ISortOptions) => {
    applicationLoading('applications');
    if (tableParams.pagination) {
      let application_size: string | null = localStorage.getItem('application_size');
      if (!application_size) {
        localStorage.setItem('application_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        localStorage.setItem('application_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        localStorage.setItem('application_size', tableParams.pagination.pageSize.toString());
      }
    }
    let extra = '';
    if (filterOptions) {
      localStorage.setItem('application_filter_options', JSON.stringify(filterOptions));
      if (filterOptions.typeId) {
        extra += `&type_id=${filterOptions.typeId}`;
      }
      if (filterOptions.subtypeName) {
        extra += `&subtype_name=${filterOptions.subtypeName}`;
      }
      if (filterOptions.complexId) {
        extra += `&complex_id=${filterOptions.complexId}`;
      }
      if (filterOptions.buildingId) {
        extra += `&building_id=${filterOptions.buildingId}`;
      }
      if (filterOptions.fio) {
        extra += `&fio=${filterOptions.fio
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/'[^а-яА-Я\s]'/g, '')}`;
      }
      if (filterOptions.possessionType) {
        extra += `&possession_type=${filterOptions.possessionType}`;
      }
      if (filterOptions.possessionName) {
        extra += `&possession_name=${filterOptions.possessionName
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/'[^а-яА-Я0-9\s]'/g, '')}`;
      }
      if (filterOptions.phone) {
        let phone = filterOptions.phone.trim().replaceAll(/[^0-9]/g, '');
        if (['8', '7'].some((el) => el === phone.charAt(0))) {
          phone = phone.substring(1, phone.length);
        }
        extra += `&phone=${phone}`;
      }
      if (filterOptions.role) {
        extra += `&role_name=${filterOptions.role}`;
      }
      if (filterOptions.statusId) {
        extra += `&status_id=${filterOptions.statusId}`;
      }
    }
    if (sortOptions) {
      localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
      if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc)
        extra += '&created_date=dec';
      if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc)
        extra += '&created_date=inc';
      if (sortOptions.status_dec && !sortOptions.status_inc) extra += '&status=dec';
      if (!sortOptions.status_dec && sortOptions.status_inc) extra += '&status=inc';
    }
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getAllSystemApplicationsByExtraRequest(logout, page, page_size, extra);
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
      applicationSuccess(response.result);
    } else applicationLoading(null);
  };

  useEffect(() => {
    let json_array = localStorage.getItem('application_table_columns');
    let filter_array: string[] = [];

    try {
      filter_array = JSON.parse(json_array || '[]');
    } catch (e) {
      filter_array = [];
    }

    if (filter_array.length > 0) {
      if (role === 'citizen') {
        let array: ColumnsType<IApplicationCitizenColumns> = [];
        defaultCitizenColumns.forEach((el) => {
          if (el.key && filter_array.some((item) => item === el.key)) {
            array.push(el);
          }
        });
        changeCitizenTable(array);
        changeCheckboxValues(array.map(({ key }) => key as string));
      } else {
        let array: ColumnsType<IApplicationNotCitizenColumns> = [];
        defaultNotCitizenColumns.forEach((el) => {
          if (el.key && filter_array.some((item) => item === el.key)) {
            array.push(el);
          }
        });
        changeNotCitizenTable(array);
        changeCheckboxValues(array.map(({ key }) => key as string));
      }
    } else {
      if (role === 'citizen') {
        changeCitizenTable(defaultCitizenColumns);
        changeCheckboxValues(defaultCitizenColumns.map(({ key }) => key as string));
      } else {
        changeNotCitizenTable(defaultNotCitizenColumns);
        changeCheckboxValues(defaultNotCitizenColumns.map(({ key }) => key as string));
      }
    }
  }, []);

  const applicationFreshnessStatus = (
    creatingDate: string,
    normative_in_hours: number,
  ): 'fresh' | 'warning' | 'expired' => {
    if (!normative_in_hours) return 'expired';
    const difference = differenceBetweenNowAndNormativeDates(creatingDate, normative_in_hours);
    if (difference <= 2 && difference > 0) return 'warning';
    if (difference <= 0) return 'expired';

    return 'fresh';
  };

  const differenceBetweenNowAndNormativeDates = (
    creatingDate: string,
    normative_in_hours: number,
  ) => {
    const nowDate = new Date();
    const [dmy, hms] = creatingDate.split(' ');
    let futureDate = new Date(`${dmy.split('.').reverse().join('-')}T${hms}`);
    futureDate.setDate(futureDate.getDate() + Math.floor(normative_in_hours / 24));
    return (futureDate.getTime() - nowDate.getTime()) / (24 * 60 * 60 * 1000);
  };

  const showForm = (app_id: number) => {
    const app = applications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(defaultAppForm);
  };

  useEffect(() => {
    if (!statuses.length) getStatuses();
    if (role === 'executor') return;
    if (role === 'citizen') return;
    if (!priorities.length) getPriorities();
    if (!sources.length) getSources();
  }, []);

  return (
    <>
      {role === 'citizen' && citizenTable && (
        <CitizenColumnsForm
          needShow={needShowColumnForm}
          changeNeedShow={changeNeedShowColumnForm}
          changeCitizenTable={changeCitizenTable}
          checkboxValues={checkboxValues}
          changeCheckboxValues={changeCheckboxValues}
        />
      )}
      {role !== 'citizen' && notCitizenTable && (
        <NotCitizenColumnsForm
          needShow={needShowColumnForm}
          changeNeedShow={changeNeedShowColumnForm}
          changeNotCitizenTable={changeNotCitizenTable}
          checkboxValues={checkboxValues}
          changeCheckboxValues={changeCheckboxValues}
        />
      )}
      <AppForm
        application={selectedItem}
        changeSelectedItem={changeSelectedItem}
        applicationFreshnessStatus={
          !selectedItem ||
          role === 'citizen' ||
          (selectedItem && selectedItem.status.name === 'Закрыта') ||
          (selectedItem && selectedItem.id === 0)
            ? 'fresh'
            : applicationFreshnessStatus(
                selectedItem.created_date,
                !selectedItem.normative ? 0 : selectedItem.normative,
              )
        }
        getAllBuildingsByComplexId={getAllBuildingsByComplexId}
        getPossessions={getPossessions}
        getTypesByComplexId={getTypesByComplexId}
        getSubtypes={getSubtypes}
        getEmploys={getEmploys}
        getCitizenPossessions={getCitizenPossessions}
        changeIsNeedToGet={changeIsNeedToGet}
      />
      <div className='mt-[68px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col m-auto mt-[22px]'>
          <div className='flex justify-start gap-x-8 pl-3 mb-8 sm:items-center max-sm:flex-col max-sm:gap-x-0 max-sm:gap-y-3'>
            <span className='text-gray-400 text-sm'>Найдено: {applications.length}</span>
            <Button
              className='w-fit border-blue-700 text-blue-700'
              onClick={() => changeNeedShowColumnForm(true)}
            >
              Изменить отображаемые столбцы
            </Button>
            {['citizen', 'dispatcher'].some((el) => el === role) && (
              <Button
                type='primary'
                className='text-white bg-blue-700 w-fit'
                onClick={() => showForm(0)}
              >
                Подать заявку
              </Button>
            )}
          </div>
          {!citizenTable && !notCitizenTable && <div className='w-[1024px]'></div>}
          {role === 'citizen' && citizenTable && (
            <CitizenTable
              showForm={showForm}
              citizenTable={citizenTable}
              tableParams={tableParams}
              setTableParams={setTableParams}
              getApplications={getApplications}
              changeIsNeedToGet={changeIsNeedToGet}
              isNeedToGet={isNeedToGet}
            />
          )}
          {role !== 'citizen' && notCitizenTable && (
            <NotCitizenTable
              showForm={showForm}
              notCitizenTable={notCitizenTable}
              tableParams={tableParams}
              setTableParams={setTableParams}
              applicationFreshnessStatus={applicationFreshnessStatus}
              getApplications={getApplications}
              changeIsNeedToGet={changeIsNeedToGet}
              isNeedToGet={isNeedToGet}
            />
          )}
        </div>
      </div>
    </>
  );
};
