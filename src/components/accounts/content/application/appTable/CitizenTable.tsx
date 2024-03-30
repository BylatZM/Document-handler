import { FC } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { IApplicationCitizenColumns, ISortingOption, ITableParams } from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface IProps {
  showForm: (application_id: number) => void;
  citizenTable: ColumnsType<IApplicationCitizenColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  makeSorting: (sortingFieldName: ISortingOption) => void;
  sortOption: ISortingOption;
}

export const CitizenTable: FC<IProps> = ({
  showForm,
  citizenTable,
  handleTableChange,
  tableParams,
  makeSorting,
  sortOption,
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
                  onClick={() =>
                    makeSorting(
                      sortOption === 'creatingDate_decreasing'
                        ? 'creatingDate_increasing'
                        : 'creatingDate_decreasing',
                    )
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    sortOption === 'creatingDate_decreasing' && 'block',
                    !['creatingDate_increasing', 'creatingDate_decreasing'].some(
                      (el) => sortOption === el,
                    ) && 'hidden',
                    sortOption === 'creatingDate_increasing' && 'rotate-180',
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
                  onClick={() =>
                    makeSorting(
                      sortOption === 'status_decreasing'
                        ? 'status_increasing'
                        : 'status_decreasing',
                    )
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    'transitionGeneral',
                    sortOption === 'status_decreasing' && 'block',
                    !['status_increasing', 'status_decreasing'].some((el) => sortOption === el) &&
                      'hidden',
                    sortOption === 'status_increasing' && 'rotate-180',
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
        number: el.id,
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
      pagination={
        (tableParams.pagination &&
          tableParams.pagination.total &&
          tableParams.pagination.pageSize &&
          tableParams.pagination.pageSize > tableParams.pagination.total) ||
        (tableParams.pagination && !tableParams.pagination.total)
          ? false
          : tableParams.pagination
      }
      onChange={handleTableChange}
      loading={isLoading}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='table-row bg-blue-700 bg-opacity-20'
      onRow={(record) => ({
        onClick: () => {
          showForm(record.number);
        },
      })}
      style={{
        width: 'fit-content',
      }}
    />
  );
};
