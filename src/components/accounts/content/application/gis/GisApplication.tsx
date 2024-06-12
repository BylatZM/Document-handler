import { CheckboxOptionType, Popover } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  ITableParams,
  IGisTableColumns,
  IGisApplication,
  IFilterGisAppOptions,
  ISortOptions,
  IEmployee,
  IType,
  ISubtype,
} from '../../../../types';
import { BsFilterRight } from 'react-icons/bs';
import { FC, useEffect, useState } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getAllGisApplicationsByExtraRequest } from '../../../../../api/requests/Application';
import { defaultColumns } from './TableArgs';
import { ColumnsForm } from './ColumnsForm';
import { GisTable } from './GisTable';
import { DefaultAppForm } from './appForm/DefaultAppForm';

interface IProps {
  getPriorities: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  getTypes: (complex_id: string) => Promise<IType[] | void>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
}

export const GisApplication: FC<IProps> = ({
  getPriorities,
  getStatuses,
  getEmploys,
  getTypes,
  getSubtypes,
}) => {
  const { gisApplications, priorities, statuses } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes } = useTypedSelector((state) => state.PossessionReducer);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [selectedItem, changeSelectedItem] = useState<IGisApplication | null>(null);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [gisTable, changeGisTable] = useState<null | ColumnsType<IGisTableColumns>>(null);
  const { applicationLoading, gisApplicationSuccess } = useActions();
  const page_size = localStorage.getItem('gis_application_size');
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
  const [filterOptions, setFilterOptions] = useState<IFilterGisAppOptions>({
    complexId: null,
    buildingAddress: null,
    statusId: null,
    phone: null,
    email: null,
    fio: null,
    possessionName: null,
    applicationType: null,
  });
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
  });
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const logout = useLogout();

  const applicationFreshnessStatus = (
    creatingDate: string,
    normative_in_hours: number,
  ): 'fresh' | 'warning' | 'expired' => {
    if (!normative_in_hours) return 'expired';
    const difference = DifferenceBetweenNowAndNormativeDates(creatingDate, normative_in_hours);
    if (difference <= 2 && difference > 0) return 'warning';
    if (difference <= 0) return 'expired';

    return 'fresh';
  };

  const DifferenceBetweenNowAndNormativeDates = (
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
    const app = gisApplications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(DefaultAppForm);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    changeIsNeedToGet(true);
    setTableParams({
      pagination,
    });
  };
  const getApplications = async () => {
    applicationLoading('gisApplications');

    localStorage.setItem('gis_application_sort_options', JSON.stringify(sortOptions));
    localStorage.setItem('gis_application_filter_options', JSON.stringify(filterOptions));
    let extra = '';
    if (filterOptions.complexId) {
      extra += `&complex_id=${filterOptions.complexId}`;
    }
    if (filterOptions.buildingAddress) {
      extra += `&building_address=${filterOptions.buildingAddress}`;
    }
    if (filterOptions.fio) {
      extra += `&fio=${filterOptions.fio}`;
    }
    if (filterOptions.email) {
      extra += `&email=${filterOptions.email}`;
    }
    if (filterOptions.possessionName) {
      extra += `&possession_name=${filterOptions.possessionName}`;
    }
    if (filterOptions.phone) {
      extra += `&phone=${filterOptions.phone}`;
    }
    if (filterOptions.statusId) {
      extra += `&status_id=${filterOptions.statusId}`;
    }
    if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc)
      extra += '&created_date=dec';
    if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc)
      extra += '&created_date=inc';
    if (sortOptions.status_dec && !sortOptions.status_inc) extra += '&status=dec';
    if (!sortOptions.status_dec && sortOptions.status_inc) extra += '&status=inc';
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getAllGisApplicationsByExtraRequest(logout, page, page_size, extra);
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
      gisApplicationSuccess(response.result);
    } else applicationLoading(null);
  };

  const options = defaultColumns.map(({ key, title }) => ({
    label: title,
    value: key,
  })) as CheckboxOptionType[];

  useEffect(() => {
    let sortParams = localStorage.getItem('gis_application_sort_options');
    let parsedSortObject: ISortOptions = sortOptions;
    if (sortParams) {
      try {
        parsedSortObject = JSON.parse(sortParams);
        setSortOptions(parsedSortObject);
      } catch (e) {
        localStorage.setItem('gis_application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('gis_application_sort_options', JSON.stringify(sortOptions));

    let filterParams = localStorage.getItem('gis_application_filter_options');
    let parsedFilterObject: IFilterGisAppOptions | null = null;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem('gis_application_filter_options', JSON.stringify(filterOptions));
      }
    } else localStorage.setItem('gis_application_filter_options', JSON.stringify(filterOptions));

    let json_array = localStorage.getItem('gis_application_table_columns');
    let filter_array: string[] = [];

    try {
      filter_array = JSON.parse(json_array || '[]');
    } catch (e) {
      filter_array = [];
    }

    if (filter_array.length > 0) {
      let array: ColumnsType<IGisTableColumns> = [];
      defaultColumns.forEach((el) => {
        if (el.key && filter_array.some((item) => item === el.key)) {
          array.push(el);
        }
      });
      changeGisTable(array);
      changeCheckboxValues(array.map(({ key }) => key as string));
    } else {
      changeGisTable(defaultColumns);
      changeCheckboxValues(defaultColumns.map(({ key }) => key as string));
    }
    changeIsNeedToGet(true);
  }, []);

  useEffect(() => {
    if (role === 'executor') return;
    if (!statuses.length) getStatuses();
    if (!priorities.length) getPriorities();
  }, []);

  useEffect(() => {
    if (isNeedToGet && tableParams.pagination) {
      let application_size: string | null = localStorage.getItem('gis_application_size');
      if (!application_size) {
        localStorage.setItem('gis_application_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        size = 10;
        localStorage.setItem('gis_application_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        size = tableParams.pagination.pageSize;
        localStorage.setItem('gis_application_size', tableParams.pagination.pageSize.toString());
      }
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageSize: size,
        },
      }));
      getApplications();
      changeIsNeedToGet(false);
    }
  }, [isNeedToGet]);

  return (
    <>
      <ColumnsForm
        needShow={needShowColumnForm}
        changeNeedShow={changeNeedShowColumnForm}
        changeTable={changeGisTable}
        checkboxValues={checkboxValues}
        changeCheckboxValues={changeCheckboxValues}
        options={options}
      />
      <AppForm
        gisApplication={selectedItem}
        getGisApplications={getApplications}
        changeSelectedItem={changeSelectedItem}
        applicationFreshnessStatus={
          !selectedItem ||
          (selectedItem && selectedItem.status.name === 'Закрыта') ||
          (selectedItem && selectedItem.id === 0)
            ? 'fresh'
            : applicationFreshnessStatus(
                selectedItem.created_date,
                !selectedItem.normative ? 0 : selectedItem.normative,
              )
        }
        getEmploys={getEmploys}
        getSubtypes={getSubtypes}
        getTypes={getTypes}
      />
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col m-auto mt-[22px]'>
          <div className='flex justify-start gap-x-8 pl-3 mb-8 items-center'>
            <span className='text-gray-400 min-w-max text-sm'>
              Найдено: {gisApplications.length}
            </span>
            <Popover content='Изменить отображаемые столбцы таблицы' placement='right'>
              <button
                className='outline-none border-none bg-inherit'
                onClick={() => changeNeedShowColumnForm(true)}
              >
                <BsFilterRight className='text-3xl' />
              </button>
            </Popover>
          </div>
          {!gisTable && <div className='w-[1024px]'></div>}
          {gisTable && (
            <GisTable
              showForm={showForm}
              gisTable={gisTable}
              handleTableChange={handleTableChange}
              tableParams={tableParams}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              sortOptions={sortOptions}
              setSortOptions={setSortOptions}
              changeIsNeedToGet={changeIsNeedToGet}
              complexes={complexes}
              statuses={statuses}
              applicationFreshnessStatus={applicationFreshnessStatus}
            />
          )}
        </div>
      </div>
    </>
  );
};
