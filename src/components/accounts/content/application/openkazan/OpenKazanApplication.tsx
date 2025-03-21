import { Button, CheckboxOptionType } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType } from 'antd/es/table';
import {
  ITableParams,
  ISortOptions,
  IOpenKazanApplication,
  IOpenKazanTableColumns,
  IFilterOpenKazanAppOptions,
} from '../../../../types';
import { FC, useEffect, useState } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getAllOpenKazanApplicationsByExtraRequest } from '../../../../../api/requests/Application';
import { defaultColumns } from './TableArgs';
import { ColumnsForm } from './ColumnsForm';
import { OpenKazanTable } from './OpenKazanTable';
import { DefaultAppForm } from './appForm/DefaultAppForm';

interface IProps {
  getStatuses: () => Promise<void>;
}

export const OpenKazanApplication: FC<IProps> = ({ getStatuses }) => {
  const { openKazanApplications, statuses } = useTypedSelector((state) => state.ApplicationReducer);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [selectedItem, changeSelectedItem] = useState<IOpenKazanApplication | null>(null);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [openKazanTable, changeOpenKazanTable] =
    useState<null | ColumnsType<IOpenKazanTableColumns>>(null);
  const { applicationLoading, openKazanApplicationSuccess } = useActions();
  const page_size = localStorage.getItem('open_kazan_application_size');
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
  const [isNeedToGet, changeIsNeedToGet] = useState(false);

  const showForm = (app_id: number) => {
    const app = openKazanApplications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(DefaultAppForm);
  };

  const getOpenKazanApplications = async (
    filterOptions?: IFilterOpenKazanAppOptions,
    sortOptions?: ISortOptions,
  ) => {
    applicationLoading('openKazanApplications');
    if (tableParams.pagination) {
      let application_size: string | null = localStorage.getItem('open_kazan_application_size');
      if (!application_size) {
        localStorage.setItem('open_kazan_application_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        size = 10;
        localStorage.setItem('open_kazan_application_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        size = tableParams.pagination.pageSize;
        localStorage.setItem(
          'open_kazan_application_size',
          tableParams.pagination.pageSize.toString(),
        );
      }
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageSize: size,
        },
      }));
    }
    let extra = '';
    if (filterOptions) {
      localStorage.setItem('open_kazan_application_filter_options', JSON.stringify(filterOptions));
      if (filterOptions.employeeName) {
        extra += `&employee_name=${filterOptions.employeeName}`;
      }
      if (filterOptions.typeStatusName) {
        extra += `&type_status_name=${filterOptions.typeStatusName}`;
      }
      if (filterOptions.typeName) {
        extra += `&type_name=${filterOptions.typeName}`;
      }
      if (filterOptions.subtypeName) {
        extra += `&type_name=${filterOptions.subtypeName}`;
      }
      if (filterOptions.buildingAddress) {
        extra += `&building_address=${filterOptions.buildingAddress
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[^0-9\.\,а-яА-Я\s]/g, '')}`;
      }
      if (filterOptions.fio) {
        extra += `&fio=${filterOptions.fio
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[а-яА-Я\s]/g, '')}`;
      }
      if (filterOptions.possessionName) {
        extra += `&possession_name=${filterOptions.possessionName
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/[^0-9]/g, '')}`;
      }
      if (filterOptions.phone) {
        let phone = filterOptions.phone.trim().replaceAll(/[^0-9]/g, '');
        if (['8', '7'].some((el) => el === phone.charAt(0))) {
          phone = phone.substring(1, phone.length);
        }
        extra += `&phone=${phone}`;
      }
      if (filterOptions.statusId) {
        extra += `&status_id=${filterOptions.statusId}`;
      }
    }
    if (sortOptions) {
      localStorage.setItem('open_kazan_application_sort_options', JSON.stringify(sortOptions));
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
    const response = await getAllOpenKazanApplicationsByExtraRequest(
      logout,
      page,
      page_size,
      extra,
    );
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
      openKazanApplicationSuccess(response.result);
    } else applicationLoading(null);
  };

  const options = defaultColumns.map(({ key, title }) => ({
    label: title,
    value: key,
  })) as CheckboxOptionType[];

  useEffect(() => {
    let json_array = localStorage.getItem('open_kazan_application_table_columns');
    let filter_array: string[] = [];

    try {
      filter_array = JSON.parse(json_array || '[]');
    } catch (e) {
      filter_array = [];
    }

    if (filter_array.length > 0) {
      let array: ColumnsType<IOpenKazanTableColumns> = [];
      defaultColumns.forEach((el) => {
        if (el.key && filter_array.some((item) => item === el.key)) {
          array.push(el);
        }
      });
      changeOpenKazanTable(array);
      changeCheckboxValues(array.map(({ key }) => key as string));
    } else {
      changeOpenKazanTable(defaultColumns);
      changeCheckboxValues(defaultColumns.map(({ key }) => key as string));
    }
  }, []);

  const getFreshnessStatus = (): 'fresh' | 'warning' | 'expired' => {
    if (!selectedItem) return 'expired';

    if (selectedItem.is_warning) return 'warning';
    if (selectedItem.is_expired) return 'expired';
    return 'fresh';
  };

  useEffect(() => {
    if (role === 'executor') return;
    if (!statuses.length) getStatuses();
  }, []);

  return (
    <>
      <ColumnsForm
        needShow={needShowColumnForm}
        changeNeedShow={changeNeedShowColumnForm}
        changeTable={changeOpenKazanTable}
        checkboxValues={checkboxValues}
        changeCheckboxValues={changeCheckboxValues}
        options={options}
      />
      {selectedItem && (
        <AppForm
          openKazanApplication={selectedItem}
          changeIsNeedToGet={changeIsNeedToGet}
          changeSelectedItem={changeSelectedItem}
          applicationFreshnessStatus={getFreshnessStatus()}
        />
      )}
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col m-auto mt-[22px]'>
          <div className='flex justify-start gap-x-8 pl-3 mb-8 sm:items-center max-sm:flex-col max-sm:gap-x-0 max-sm:gap-y-3'>
            <span className='text-gray-400 w-fit text-sm'>
              Найдено: {openKazanApplications.length}
            </span>
            <Button
              className='w-fit border-blue-700 text-blue-700'
              onClick={() => changeNeedShowColumnForm(true)}
            >
              Изменить отображаемые столбцы
            </Button>
          </div>
          {!openKazanTable && <div className='w-[1024px]'></div>}
          {openKazanTable && (
            <OpenKazanTable
              showForm={showForm}
              openKazanTable={openKazanTable}
              tableParams={tableParams}
              statuses={statuses}
              setTableParams={setTableParams}
              getOpenKazanApplications={getOpenKazanApplications}
              isNeedToGet={isNeedToGet}
              changeIsNeedToGet={changeIsNeedToGet}
            />
          )}
        </div>
      </div>
    </>
  );
};
