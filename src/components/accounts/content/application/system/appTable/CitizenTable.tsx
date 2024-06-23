import { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IApplicationCitizenColumns,
  IFilterAppOptions,
  ISortOptions,
  ITableParams,
} from '../../../../../types';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';

interface IProps {
  showForm: (application_id: number) => void;
  citizenTable: ColumnsType<IApplicationCitizenColumns>;
  tableParams: ITableParams;
  setTableParams: React.Dispatch<React.SetStateAction<ITableParams>>;
  getApplications: (filterOptions?: IFilterAppOptions, sortOptions?: ISortOptions) => Promise<void>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  isNeedToGet: boolean;
}

export const CitizenTable: FC<IProps> = ({
  showForm,
  citizenTable,
  tableParams,
  setTableParams,
  getApplications,
  changeIsNeedToGet,
  isNeedToGet,
}) => {
  const { applications, isLoading } = useTypedSelector((state) => state.ApplicationReducer);
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
  });

  const mainProcesses = async () => {
    getApplications(undefined, sortOptions);
    changeIsNeedToGet((prev) => !prev);
  };

  useEffect(() => {
    if (isNeedToGet) {
      mainProcesses();
    }
  }, [isNeedToGet]);

  useEffect(() => {
    let sortParams = localStorage.getItem('application_sort_options');
    if (sortParams) {
      try {
        setSortOptions(JSON.parse(sortParams));
      } catch (e) {
        localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
    changeIsNeedToGet(true);
  }, []);

  const components = {
    header: {
      cell: (props: { children: React.ReactNode }) => {
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Дата создания'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() => {
                    if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: false,
                        creating_date_inc: true,
                      }));
                    }
                    if (!sortOptions.creating_date_dec && !sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: true,
                        creating_date_inc: false,
                      }));
                    }
                    if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: false,
                        creating_date_inc: false,
                      }));
                    }
                    changeIsNeedToGet(true);
                  }}
                >
                  {sortOptions.creating_date_dec && <FaSortDown className='text-lg text-white' />}
                  {sortOptions.creating_date_inc && <FaSortUp className='text-lg text-white' />}
                  {!sortOptions.creating_date_dec && !sortOptions.creating_date_inc && (
                    <FaSort className='text-lg text-white' />
                  )}
                </button>
              </div>
            </th>
          );
        }
        if (props.children && Array.isArray(props.children) && props.children[1] === 'Статус') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() => {
                    if (sortOptions.status_dec && !sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: false, status_inc: true }));
                    }
                    if (!sortOptions.status_dec && !sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: true, status_inc: false }));
                    }
                    if (!sortOptions.status_dec && sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: false, status_inc: false }));
                    }
                    changeIsNeedToGet(true);
                  }}
                >
                  {sortOptions.status_dec && <FaSortDown className='text-lg text-white' />}
                  {sortOptions.status_inc && <FaSortUp className='text-lg text-white' />}
                  {!sortOptions.status_dec && !sortOptions.status_inc && (
                    <FaSort className='text-lg text-white' />
                  )}
                </button>
              </div>
            </th>
          );
        }
        return (
          <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
            {props.children}
          </th>
        );
      },
    },
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    changeIsNeedToGet(true);
    setTableParams({
      pagination,
    });
  };

  return (
    <Table
      dataSource={applications.map((el) => ({
        key: el.id,
        createdDate: el.created_date,
        appType: el.type.name,
        appSubtype: el.subtype.name,
        status: el.status.name,
        dueDate: !el.due_date ? '—' : el.due_date,
        applicantComment: el.applicant_comment,
        possession: `${el.possession.type} ${el.possession.name}`,
        building: el.building.address,
        complex: el.complex.name,
        contact: el.contact,
      }))}
      columns={citizenTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'applications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='table-row bg-blue-700 bg-opacity-20'
      onRow={(record) => ({
        onClick: () => {
          showForm(record.key);
        },
      })}
    />
  );
};
