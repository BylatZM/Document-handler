import { FC } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { IGisTableColumns, ISortingOption, ITableParams } from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface IProps {
  showForm: (application_id: number) => void;
  gisTable: ColumnsType<IGisTableColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  makeSorting: (sortingFieldName: ISortingOption) => void;
  sortOption: ISortingOption;
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_hours: number,
  ) => 'fresh' | 'warning' | 'expired';
}

export const GisTable: FC<IProps> = ({
  showForm,
  gisTable,
  handleTableChange,
  tableParams,
  makeSorting,
  sortOption,
  applicationFreshnessStatus,
}) => {
  const { gisApplications } = useTypedSelector((state) => state.ApplicationReducer);
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
      dataSource={gisApplications.map((el) => ({
        key: el.id,
        creating_date: el.creating_date,
        type: el.type,
        status: el.status.appStatus,
        applicant_fio: el.applicant_fio,
        due_date: !el.due_date ? '' : el.due_date,
        applicant_сomment: el.applicant_сomment,
        possession_address: el.possession_address,
        phone: !el.phone ? '' : el.phone,
        email: !el.email ? '' : el.email,
        employee: !el.employee ? '' : `${el.employee.employee} ${el.employee.competence}`,
        normative_in_hours: !el.normative_in_hours ? 0 : el.normative_in_hours.normative_in_hours,
      }))}
      columns={gisTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'gisApplications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName={(item) => {
        if (
          applicationFreshnessStatus(item.creating_date, item.normative_in_hours) === 'expired' &&
          item.status !== 'Закрыта'
        ) {
          return 'table-row bg-red-400 bg-opacity-80';
        }
        if (
          applicationFreshnessStatus(item.creating_date, item.normative_in_hours) === 'warning' &&
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
