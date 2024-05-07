import { FC } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { FaLongArrowAltUp } from 'react-icons/fa';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { IApplicationNotCitizenColumns, ISortOptions, ITableParams } from '../../../../../types';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';

interface IProps {
  showForm: (application_id: number) => void;
  notCitizenTable: ColumnsType<IApplicationNotCitizenColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_days: number,
  ) => 'fresh' | 'warning' | 'expired';
  sortOptions: ISortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<ISortOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

const default_subtype = {
  name: '',
  normative: 120,
};

export const NotCitizenTable: FC<IProps> = ({
  showForm,
  notCitizenTable,
  handleTableChange,
  tableParams,
  applicationFreshnessStatus,
  sortOptions,
  setSortOptions,
  changeIsNeedToGet,
}) => {
  const { applications } = useTypedSelector((state) => state.ApplicationReducer);
  const { isLoading } = useTypedSelector((state) => state.ApplicationReducer);

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
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaLongArrowAltUp
                  className={clsx(
                    'text-lg font-bold',
                    sortOptions.creating_date_dec && 'block rotate-[145deg]',
                    !sortOptions.creating_date_dec && !sortOptions.creating_date_inc && 'hidden',
                    sortOptions.creating_date_inc && 'block rotate-45',
                  )}
                />
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
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaLongArrowAltUp
                  className={clsx(
                    'text-lg font-bold',
                    sortOptions.status_dec && 'block rotate-[145deg]',
                    !sortOptions.status_dec && !sortOptions.status_inc && 'hidden',
                    sortOptions.status_inc && 'block rotate-45',
                  )}
                />
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

  return (
    <Table
      dataSource={applications.map((el) => ({
        key: el.id,
        createdDate: !el.created_date ? '' : el.created_date,
        appType: !el.type ? '' : el.type.name,
        appSubtype: !el.subtype
          ? default_subtype
          : { name: el.subtype.name, normative: el.subtype.normative_in_hours },
        status: !el.status ? '' : el.status.name,
        dueDate: !el.due_date ? '' : el.due_date,
        applicantComment: el.applicant_comment,
        possession: `${el.possession.type} ${el.possession.name}`,
        building: el.building.address,
        complex: el.complex.name,
        contact: el.contact,
        employee: !el.employee ? '' : el.employee.employee,
        creator: el.applicant.role === 'dispatcher' ? 'Диспетчер' : 'Житель',
      }))}
      columns={notCitizenTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'applications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName={(item) => {
        if (
          applicationFreshnessStatus(item.createdDate, item.appSubtype.normative) === 'expired' &&
          item.status !== 'Закрыта'
        ) {
          return 'table-row bg-red-400 bg-opacity-80';
        }
        if (
          applicationFreshnessStatus(item.createdDate, item.appSubtype.normative) === 'warning' &&
          item.status !== 'Закрыта'
        ) {
          return 'table-row bg-amber-400 bg-opacity-80';
        }
        return 'table-row bg-blue-700 bg-opacity-20';
      }}
      onRow={(record) => ({
        onClick: () => {
          showForm(record.key);
        },
      })}
      style={{
        width: 'fit-content',
      }}
    />
  );
};
