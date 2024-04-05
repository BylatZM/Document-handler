import { Button, CheckboxOptionType, ConfigProvider, Popover } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IApplication,
  IApplicationCitizenColumns,
  IApplicationNotCitizenColumns,
  ITableParams,
  ISortingOption,
} from '../../../../types';
import { BsFilterRight } from 'react-icons/bs';
import { defaultCitizenColumns, defaultNotCitizenColumns } from './ApplicationTableArgs';
import { useEffect, useState } from 'react';
import { CitizenTable } from './appTable/CitizenTable';
import { NotCitizenTable } from './appTable/NotCitizenTable';
import { CitizenColumnsForm } from './changeTableColumnsForms/CitizenColumnsForm';
import { NotCitizenColumnsForm } from './changeTableColumnsForms/NotCitizenColumnsForm';
import { useActions } from '../../../../hooks/useActions';
import { getApplicationsRequest } from '../../../../../api/requests/Application';
import { useLogout } from '../../../../hooks/useLogout';
import { defaultAppForm } from './appForm/defaultAppForm';

export const Application = () => {
  const { applications } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState<IApplication | null>(null);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [citizenTable, changeCitizenTable] =
    useState<null | ColumnsType<IApplicationCitizenColumns>>(null);
  const [notCitizenTable, changeNotCitizenTable] =
    useState<null | ColumnsType<IApplicationNotCitizenColumns>>(null);
  const { applicationLoading, applicationSuccess } = useActions();
  const [sortOption, setSortOption] = useState<ISortingOption>(null);
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
  const [isTotalUpdated, changeIsTotalUpdated] = useState(false);
  const logout = useLogout();

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

  const makeSorting = (sortingFieldName: ISortingOption) => {
    setSortOption(sortingFieldName);

    if (sortingFieldName === 'status_decreasing') {
      applicationSuccess([...applications].sort((a, b) => a.status.id - b.status.id));
    }
    if (sortingFieldName === 'status_increasing') {
      applicationSuccess([...applications].sort((a, b) => b.status.id - a.status.id));
    }

    if (sortingFieldName === 'creatingDate_decreasing') {
      applicationSuccess(
        [...applications].sort((a, b) => {
          const dateA = new Date(
            a.creatingDate.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          const dateB = new Date(
            b.creatingDate.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          return dateA.getTime() - dateB.getTime();
        }),
      );
    }

    if (sortingFieldName === 'creatingDate_increasing') {
      applicationSuccess(
        [...applications].sort((a, b) => {
          const dateA = new Date(
            a.creatingDate.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          const dateB = new Date(
            b.creatingDate.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          return dateB.getTime() - dateA.getTime();
        }),
      );
    }
  };

  const showForm = (app_id: number) => {
    const app = applications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(defaultAppForm);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    changeIsTotalUpdated(false);
    setTableParams({
      pagination,
    });
  };
  const getApplications = async () => {
    applicationLoading(true);
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getApplicationsRequest(logout, page, page_size);
    if (response) {
      if (
        (tableParams.pagination && !tableParams.pagination.total) ||
        (tableParams.pagination &&
          tableParams.pagination.total &&
          tableParams.pagination.total !== response.total)
      ) {
        changeIsTotalUpdated(true);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: response.total,
          },
        });
      }
      applicationSuccess(response.result);
      setSortOption(null);
    } else applicationLoading(false);
  };

  const options =
    role === 'citizen'
      ? (defaultCitizenColumns.map(({ key, title }) => ({
          label: title,
          value: key,
        })) as CheckboxOptionType[])
      : (defaultNotCitizenColumns.map(({ key, title }) => ({
          label: title,
          value: key,
        })) as CheckboxOptionType[]);

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

  useEffect(() => {
    if (!isTotalUpdated && tableParams.pagination) {
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
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageSize: size,
        },
      }));
      if (tableParams.pagination.pageSize === size) getApplications();
    } else changeIsTotalUpdated(false);
  }, [JSON.stringify(tableParams)]);

  return (
    <>
      {role === 'citizen' && citizenTable && (
        <CitizenColumnsForm
          needShow={needShowColumnForm}
          changeNeedShow={changeNeedShowColumnForm}
          changeCitizenTable={changeCitizenTable}
          checkboxValues={checkboxValues}
          changeCheckboxValues={changeCheckboxValues}
          options={options}
        />
      )}
      {role !== 'citizen' && notCitizenTable && (
        <NotCitizenColumnsForm
          needShow={needShowColumnForm}
          changeNeedShow={changeNeedShowColumnForm}
          changeNotCitizenTable={changeNotCitizenTable}
          checkboxValues={checkboxValues}
          changeCheckboxValues={changeCheckboxValues}
          options={options}
        />
      )}
      <AppForm
        application={selectedItem}
        getApplications={getApplications}
        changeSelectedItem={changeSelectedItem}
        applicationFreshnessStatus={
          !selectedItem ||
          role === 'citizen' ||
          (selectedItem && selectedItem.status.appStatus === 'Закрыта') ||
          (selectedItem && selectedItem.id === 0)
            ? 'fresh'
            : applicationFreshnessStatus(
                selectedItem.creatingDate,
                !selectedItem.subtype ? 0 : selectedItem.subtype.normative,
              )
        }
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
              makeSorting={makeSorting}
              sortOption={sortOption}
            />
          )}
          {role !== 'citizen' && notCitizenTable && (
            <NotCitizenTable
              showForm={showForm}
              notCitizenTable={notCitizenTable}
              handleTableChange={handleTableChange}
              tableParams={tableParams}
              makeSorting={makeSorting}
              sortOption={sortOption}
              applicationFreshnessStatus={applicationFreshnessStatus}
            />
          )}
        </div>
      </div>
    </>
  );
};
