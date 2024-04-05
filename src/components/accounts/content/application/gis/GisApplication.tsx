import { CheckboxOptionType, Popover } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ITableParams, ISortingOption, IGisTableColumns, IGisApplication } from '../../../../types';
import { BsFilterRight } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getGisApplicationsRequest } from '../../../../../api/requests/Application';
import { defaultColumns } from './TableArgs';
import { ColumnsForm } from './ColumnsForm';
import { GisTable } from './GisTable';
import { DefaultAppForm } from './appForm/DefaultAppForm';

export const GisApplication = () => {
  const { gisApplications } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState<IGisApplication | null>(null);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [gisTable, changeGisTable] = useState<null | ColumnsType<IGisTableColumns>>(null);
  const { applicationLoading, gisApplicationSuccess } = useActions();
  const [sortOption, setSortOption] = useState<ISortingOption>(null);
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
  const [isTotalUpdated, changeIsTotalUpdated] = useState(false);
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

  const makeSorting = (sortingFieldName: ISortingOption) => {
    setSortOption(sortingFieldName);

    if (sortingFieldName === 'status_decreasing') {
      gisApplicationSuccess([...gisApplications].sort((a, b) => a.status.id - b.status.id));
    }
    if (sortingFieldName === 'status_increasing') {
      gisApplicationSuccess([...gisApplications].sort((a, b) => b.status.id - a.status.id));
    }

    if (sortingFieldName === 'creatingDate_decreasing') {
      gisApplicationSuccess(
        [...gisApplications].sort((a, b) => {
          const dateA = new Date(
            a.creating_date.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          const dateB = new Date(
            b.creating_date.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          return dateA.getTime() - dateB.getTime();
        }),
      );
    }

    if (sortingFieldName === 'creatingDate_increasing') {
      gisApplicationSuccess(
        [...gisApplications].sort((a, b) => {
          const dateA = new Date(
            a.creating_date.replace(
              /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
              '$3-$2-$1T$4:$5:$6',
            ),
          );
          const dateB = new Date(
            b.creating_date.replace(
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
    const app = gisApplications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(DefaultAppForm);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
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
    const response = await getGisApplicationsRequest(logout, page, page_size);
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
      gisApplicationSuccess(response.result);
      setSortOption(null);
    } else applicationLoading(false);
  };

  const options = defaultColumns.map(({ key, title }) => ({
    label: title,
    value: key,
  })) as CheckboxOptionType[];

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!isTotalUpdated && tableParams.pagination) {
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
      if (tableParams.pagination?.pageSize === size) getApplications();
    } else changeIsTotalUpdated(false);
  }, [JSON.stringify(tableParams)]);

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
          (selectedItem && selectedItem.status.appStatus === 'Закрыта') ||
          (selectedItem && selectedItem.id === 0)
            ? 'fresh'
            : applicationFreshnessStatus(
                selectedItem.creating_date,
                !selectedItem.normative_in_hours
                  ? 0
                  : selectedItem.normative_in_hours.normative_in_hours,
              )
        }
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
