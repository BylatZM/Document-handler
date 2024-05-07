import { Button, ConfigProvider, Popover } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
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
} from '../../../../types';
import { BsFilterRight } from 'react-icons/bs';
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
  getTypes: (complex_id: string) => Promise<IType[] | void>;
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
  getTypes,
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
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
  });
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
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const logout = useLogout();

  const getApplications = async () => {
    applicationLoading('applications');
    localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
    let extra = '';
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

  const handleTableChange = (pagination: TablePaginationConfig) => {
    changeIsNeedToGet(true);
    setTableParams({
      pagination,
    });
  };

  useEffect(() => {
    if (!statuses.length) getStatuses();
    if (role === 'executor') return;
    if (role === 'citizen') return;
    if (!priorities.length) getPriorities();
    if (!sources.length) getSources();
  }, []);

  useEffect(() => {
    let sort_params = localStorage.getItem('application_sort_options');
    let parsed_object: ISortOptions = sortOptions;
    if (sort_params) {
      try {
        parsed_object = JSON.parse(sort_params);
        setSortOptions(parsed_object);
      } catch (e) {
        localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));

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
    changeIsNeedToGet(true);
  }, []);

  useEffect(() => {
    if (isNeedToGet && tableParams.pagination) {
      let application_size: string | null = localStorage.getItem('application_size');
      if (!application_size) {
        localStorage.setItem('application_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        size = 10;
        localStorage.setItem('application_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        size = tableParams.pagination.pageSize;
        localStorage.setItem('application_size', tableParams.pagination.pageSize.toString());
      }
      getApplications();
      changeIsNeedToGet(false);
    }
  }, [isNeedToGet]);

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
        getApplications={getApplications}
        changeSelectedItem={changeSelectedItem}
        applicationFreshnessStatus={
          !selectedItem ||
          role === 'citizen' ||
          (selectedItem && selectedItem.status.name === 'Закрыта') ||
          (selectedItem && selectedItem.id === 0)
            ? 'fresh'
            : applicationFreshnessStatus(
                selectedItem.created_date,
                !selectedItem.subtype ? 0 : selectedItem.subtype.normative_in_hours,
              )
        }
        getAllBuildingsByComplexId={getAllBuildingsByComplexId}
        getPossessions={getPossessions}
        getTypes={getTypes}
        getSubtypes={getSubtypes}
        getEmploys={getEmploys}
        getCitizenPossessions={getCitizenPossessions}
      />
      <div className='mt-[68px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col m-auto mt-[22px]'>
          <div className='flex justify-start gap-x-8 pl-3 mb-8 items-center'>
            <span className='text-gray-400 min-w-max text-sm'>Найдено: {applications.length}</span>
            <div className='flex gap-x-8'>
              <Popover content='Изменить отображаемые столбцы таблицы' placement='right'>
                <button
                  className='outline-none border-none bg-inherit'
                  onClick={() => changeNeedShowColumnForm(true)}
                >
                  <BsFilterRight className='text-3xl' />
                </button>
              </Popover>
              <>
                {['citizen', 'dispatcher'].some((el) => el === role) && (
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorPrimaryHover: '#fff',
                        },
                        Popover: {
                          zIndexPopup: 10,
                        },
                      },
                    }}
                  >
                    <Popover placement='right' content='Создать заявку'>
                      <Button
                        className='w-[30px] h-[30px] rounded-full border-none bg-blue-700 text-white flex items-center justify-center'
                        onClick={() => showForm(0)}
                      >
                        +
                      </Button>
                    </Popover>
                  </ConfigProvider>
                )}
              </>
            </div>
          </div>
          {!citizenTable && !notCitizenTable && <div className='w-[1024px]'></div>}
          {role === 'citizen' && citizenTable && (
            <CitizenTable
              showForm={showForm}
              citizenTable={citizenTable}
              handleTableChange={handleTableChange}
              tableParams={tableParams}
              sortOptions={sortOptions}
              setSortOptions={setSortOptions}
              changeIsNeedToGet={changeIsNeedToGet}
            />
          )}
          {role !== 'citizen' && notCitizenTable && (
            <NotCitizenTable
              showForm={showForm}
              notCitizenTable={notCitizenTable}
              handleTableChange={handleTableChange}
              tableParams={tableParams}
              applicationFreshnessStatus={applicationFreshnessStatus}
              sortOptions={sortOptions}
              setSortOptions={setSortOptions}
              changeIsNeedToGet={changeIsNeedToGet}
            />
          )}
        </div>
      </div>
    </>
  );
};
