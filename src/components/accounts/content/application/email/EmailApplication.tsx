import { Button, CheckboxOptionType } from 'antd';
import { AppForm } from './appForm/AppForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ColumnsType } from 'antd/es/table';
import {
  ITableParams,
  IEmailApplication,
  IEmailTableColumns,
  IEmployee,
  IType,
  ISubtype,
  ISortOptions,
  IFilterEmailAppOptions,
  IAddingFile,
} from '../../../../types';
import { FC, useEffect, useState } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useLogout } from '../../../../hooks/useLogout';
import { getAllEmailApplicationsByExtraRequest } from '../../../../../api/requests/Application';
import { defaultColumns } from './TableArgs';
import { ColumnsForm } from './ColumnsForm';
import { EmailTable } from './EmailTable';
import { DefaultAppForm } from './appForm/DefaultAppForm';

interface IProps {
  getPriorities: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  getTypesByComplexId: (complex_id: string) => Promise<IType[] | void>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  isFileGood: (file: File, fileStorage: IAddingFile[]) => boolean;
  getBase64: (file: File) => Promise<string>;
}

export const EmailApplication: FC<IProps> = ({
  getPriorities,
  getStatuses,
  getEmploys,
  getTypesByComplexId,
  getSubtypes,
  isFileGood,
  getBase64,
}) => {
  const { emailApplications, priorities, statuses } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes } = useTypedSelector((state) => state.PossessionReducer);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [selectedItem, changeSelectedItem] = useState<IEmailApplication | null>(null);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [emailTable, changeEmailTable] = useState<null | ColumnsType<IEmailTableColumns>>(null);
  const { applicationLoading, emailApplicationSuccess } = useActions();
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const page_size = localStorage.getItem('email_application_size');
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
    const app = emailApplications.filter((el) => el.id === app_id);
    if (app.length) changeSelectedItem(app[0]);
    else changeSelectedItem(DefaultAppForm);
  };

  const getApplications = async (
    filterOptions?: IFilterEmailAppOptions,
    sortOptions?: ISortOptions,
  ) => {
    applicationLoading('emailApplications');
    if (tableParams.pagination) {
      let application_size: string | null = localStorage.getItem('email_application_size');
      if (!application_size) {
        localStorage.setItem('email_application_size', '10');
        application_size = '10';
      }
      let size = parseInt(application_size);
      if (isNaN(size) || size < 1) {
        size = 10;
        localStorage.setItem('email_application_size', '10');
      }
      if (tableParams.pagination.pageSize && size !== tableParams.pagination.pageSize) {
        size = tableParams.pagination.pageSize;
        localStorage.setItem('email_application_size', tableParams.pagination.pageSize.toString());
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
      localStorage.setItem('email_application_filter_options', JSON.stringify(filterOptions));
      if (filterOptions.typeId) {
        extra += `&type_id=${filterOptions.typeId}`;
      }
      if (filterOptions.subtypeName) {
        extra += `&subtype_name=${filterOptions.subtypeName}`;
      }
      if (filterOptions.complexId) {
        extra += `&complex_id=${filterOptions.complexId}`;
      }
      if (filterOptions.buildingAddress) {
        extra += `&building_address=${filterOptions.buildingAddress
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/'[^а-яА-Я\s\.\,0-9]'/g, '')}`;
      }
      if (filterOptions.fio) {
        extra += `&fio=${filterOptions.fio
          .trim()
          .replaceAll(/\s\s/g, '')
          .replaceAll(/'[^а-яА-Я\s]'/g, '')}`;
      }
      if (filterOptions.email) {
        extra += `&email=${filterOptions.email.trim().replaceAll(/\s\s/g, '')}`;
      }
      if (filterOptions.possessionName) {
        extra += `&possession_name=${filterOptions.possessionName
          .trim()
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
      localStorage.setItem('email_application_sort_options', JSON.stringify(sortOptions));
      if (sortOptions.status_dec && !sortOptions.status_inc) extra += '&status=dec';
      if (!sortOptions.status_dec && sortOptions.status_inc) extra += '&status=inc';
      if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc)
        extra += '&created_date=dec';
      if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc)
        extra += '&created_date=inc';
    }
    let page = '1';
    let page_size = '2';
    if (tableParams.pagination?.current) page = tableParams.pagination.current.toString();
    if (tableParams.pagination?.pageSize) page_size = tableParams.pagination.pageSize.toString();
    const response = await getAllEmailApplicationsByExtraRequest(logout, page, page_size, extra);
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
      emailApplicationSuccess(response.result);
    } else applicationLoading(null);
  };

  const options = defaultColumns.map(({ key, title }) => ({
    label: title,
    value: key,
  })) as CheckboxOptionType[];

  useEffect(() => {
    let json_array = localStorage.getItem('email_application_table_columns');
    let filter_array: string[] = [];

    try {
      filter_array = JSON.parse(json_array || '[]');
    } catch (e) {
      filter_array = [];
    }

    if (filter_array.length > 0) {
      let array: ColumnsType<IEmailTableColumns> = [];
      defaultColumns.forEach((el) => {
        if (el.key && filter_array.some((item) => item === el.key)) {
          array.push(el);
        }
      });
      changeEmailTable(array);
      changeCheckboxValues(array.map(({ key }) => key as string));
    } else {
      changeEmailTable(defaultColumns);
      changeCheckboxValues(defaultColumns.map(({ key }) => key as string));
    }
  }, []);

  useEffect(() => {
    if (role === 'executor') return;
    if (!statuses.length) getStatuses();
    if (!priorities.length) getPriorities();
  }, []);

  return (
    <>
      <ColumnsForm
        needShow={needShowColumnForm}
        changeNeedShow={changeNeedShowColumnForm}
        changeTable={changeEmailTable}
        checkboxValues={checkboxValues}
        changeCheckboxValues={changeCheckboxValues}
        options={options}
      />
      <AppForm
        emailApplication={selectedItem}
        changeIsNeedToGet={changeIsNeedToGet}
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
        getTypesByComplexId={getTypesByComplexId}
        getSubtypes={getSubtypes}
        isFileGood={isFileGood}
        getBase64={getBase64}
      />
      <div className='mt-[68px] max-sm:mt-[120px] fixed inset-0 overflow-auto z-20'>
        <div className='w-max p-2 flex flex-col m-auto mt-[22px]'>
          <div className='flex justify-start gap-x-8 pl-3 mb-8 items-center'>
            <span className='text-gray-400 min-w-max text-sm'>
              Найдено: {emailApplications.length}
            </span>
            <Button
              className='w-fit border-blue-700 text-blue-700'
              onClick={() => changeNeedShowColumnForm(true)}
            >
              Изменить отображаемые столбцы
            </Button>
          </div>
          {!emailTable && <div className='w-[1024px]'></div>}
          {emailTable && (
            <EmailTable
              showForm={showForm}
              emailTable={emailTable}
              setTableParams={setTableParams}
              getApplications={getApplications}
              tableParams={tableParams}
              statuses={statuses}
              complexes={complexes}
              applicationFreshnessStatus={applicationFreshnessStatus}
              changeIsNeedToGet={changeIsNeedToGet}
              isNeedToGet={isNeedToGet}
            />
          )}
        </div>
      </div>
    </>
  );
};
