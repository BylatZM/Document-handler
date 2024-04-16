import { FC } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { FaLongArrowAltUp } from 'react-icons/fa';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { IApplicationCitizenColumns, ISortOptions, ITableParams } from '../../../../../types';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';

interface IProps {
  showForm: (application_id: number) => void;
  citizenTable: ColumnsType<IApplicationCitizenColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  sortOptions: ISortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<ISortOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CitizenTable: FC<IProps> = ({
  showForm,
  citizenTable,
  handleTableChange,
  tableParams,
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
        creating_date: !el.creatingDate ? '' : el.creatingDate,
        app_type: !el.type ? '' : el.type.appType,
        app_subtype: !el.subtype ? '' : el.subtype.subtype,
        status: !el.status ? '' : el.status.appStatus,
        due_date: !el.dueDate ? '' : el.dueDate,
        citizen_comment: el.citizenComment,
        possession: `${el.possession.type} ${el.possession.address}`,
        building: el.building.building,
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
      style={{
        width: 'fit-content',
      }}
    />
  );
};
