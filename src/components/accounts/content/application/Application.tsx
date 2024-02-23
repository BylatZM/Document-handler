import { Button, CheckboxOptionType, ConfigProvider, Popover, Table } from 'antd';
import { AppForm } from './appForm/AppForm';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { ColumnsType } from 'antd/es/table';
import { IApplicationColumns } from '../../../types';
import { ChangeShowingColumns } from './ChangeShowingColumns';
import { BsFilterRight } from 'react-icons/bs';
import { IoFunnel } from 'react-icons/io5';
import { useActions } from '../../../hooks/useActions';
import { FaArrowDownShortWide } from 'react-icons/fa6';

const defaultColumns: ColumnsType<IApplicationColumns> = [
  {
    title: '№',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Дата создания',
    dataIndex: 'creating_date',
    key: 'creating_date',
  },
  {
    title: 'Тип заявки',
    dataIndex: 'app_type',
    key: 'app_type',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'app_subtype',
    key: 'app_subType',
    render: (subtype: string) => (
      <div className='overflow-hidden max-w-[150px] text-ellipsis'>{subtype}</div>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <span
        className={clsx(
          'text-white p-2 rounded-lg',
          status === 'В работе' && 'bg-blue-700',
          status === 'Новая' && 'bg-green-400',
          status === 'Назначена' && 'bg-green-600',
          status === 'Возвращена' && 'bg-amber-500',
          status === 'Закрыта' && 'bg-red-500',
        )}
      >
        {status}
      </span>
    ),
  },
  {
    title: 'Время закрытия',
    dataIndex: 'due_date',
    key: 'due_date',
  },
  {
    title: 'Комментарий жильца',
    dataIndex: 'citizen_comment',
    key: 'citizen_comment',
    render: (citizen_comment: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {citizen_comment}
      </div>
    ),
  },
  {
    title: 'Собственность',
    dataIndex: 'possession',
    key: 'possession',
    render: (possession: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possession}
      </div>
    ),
  },
  {
    title: 'Исполнитель',
    dataIndex: 'employee',
    key: 'employee',
    render: (employee: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {employee}
      </div>
    ),
  },
];

const options = defaultColumns.map(({ key, title }) => ({
  label: title,
  value: key,
})) as CheckboxOptionType[];

export const Application = () => {
  const [IsFormActive, changeIsFormActive] = useState(false);
  const { userApplication } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState(0);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const [needShowColumnForm, changeNeedShowColumnForm] = useState(false);
  const [checkboxValues, changeCheckboxValues] = useState<null | string[]>(null);
  const [tableColumns, changeTableColumns] = useState<null | ColumnsType<IApplicationColumns>>(
    null,
  );
  const { applicationSuccess } = useActions();
  const [sortedBy, changeSortedBy] = useState<
    | null
    | 'status_increasing'
    | 'status_decreasing'
    | 'creatingDate_increasing'
    | 'creatingDate_decreasing'
  >(null);

  const makeSorting = (
    sortingFieldName:
      | 'status_increasing'
      | 'status_decreasing'
      | 'creatingDate_increasing'
      | 'creatingDate_decreasing',
  ) => {
    changeSortedBy(sortingFieldName);

    if (sortingFieldName === 'status_decreasing') {
      applicationSuccess([...userApplication].sort((a, b) => a.status.id - b.status.id));
    }
    if (sortingFieldName === 'status_increasing') {
      applicationSuccess([...userApplication].sort((a, b) => b.status.id - a.status.id));
    }

    if (sortingFieldName === 'creatingDate_decreasing') {
      applicationSuccess(
        [...userApplication].sort((a, b) => {
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
        [...userApplication].sort((a, b) => {
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

  useEffect(() => {
    let json_array = localStorage.getItem('application_table_columns');

    if (json_array) {
      const filter_array: string[] = json_array ? JSON.parse(json_array) : [];
      let array: ColumnsType<IApplicationColumns> = [];

      defaultColumns.forEach((el) => {
        if (el.key && filter_array.some((item) => item === el.key)) {
          array.push(el);
        }
      });
      changeTableColumns(array);
      changeCheckboxValues(array.map(({ key }) => key as string));
    } else {
      changeTableColumns(defaultColumns);
      changeCheckboxValues(defaultColumns.map(({ key }) => key as string));
    }
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
                  onClick={() =>
                    makeSorting(
                      sortedBy === 'creatingDate_decreasing'
                        ? 'creatingDate_increasing'
                        : 'creatingDate_decreasing',
                    )
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    sortedBy === 'creatingDate_decreasing' && 'block',
                    !['creatingDate_increasing', 'creatingDate_decreasing'].some(
                      (el) => sortedBy === el,
                    ) && 'hidden',
                    sortedBy === 'creatingDate_increasing' && 'rotate-180',
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
                      sortedBy === 'status_decreasing' ? 'status_increasing' : 'status_decreasing',
                    )
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    'transitionGeneral',
                    sortedBy === 'status_decreasing' && 'block',
                    !['status_increasing', 'status_decreasing'].some((el) => sortedBy === el) &&
                      'hidden',
                    sortedBy === 'status_increasing' && 'rotate-180',
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

  const showForm = async (application_id: number) => {
    changeSelectedItem(application_id);
    changeIsFormActive(true);
  };

  return (
    <>
      <ChangeShowingColumns
        needShow={needShowColumnForm}
        changeNeedShow={changeNeedShowColumnForm}
        baseColumns={defaultColumns}
        changeColumns={changeTableColumns}
        checkboxValues={checkboxValues}
        changeCheckboxValues={changeCheckboxValues}
        options={options}
      />
      <AppForm
        IsFormActive={IsFormActive}
        changeIsFormActive={changeIsFormActive}
        id={selectedItem}
      />
      <div className='w-max p-2 flex flex-col m-auto gap-4'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400 min-w-max text-sm'>
              Найдено: {!userApplication ? 0 : userApplication.length}
            </span>
          </div>
          <div className='flex gap-x-6'>
            <button
              className='outline-none border-none bg-inherit'
              onClick={() => changeNeedShowColumnForm(true)}
            >
              <BsFilterRight className='text-3xl' />
            </button>
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

        {tableColumns && (
          <Table
            dataSource={userApplication.map((el) => ({
              number: el.id,
              creating_date: !el.creatingDate ? '' : el.creatingDate,
              app_type: !el.type ? '' : el.type.appType,
              app_subtype: !el.subtype || (el.subtype && !el.subtype.id) ? '' : el.subtype.subtype,
              status: !el.status ? '' : el.status.appStatus,
              due_date: !el.dueDate ? '' : el.dueDate,
              citizen_comment: el.citizenComment,
              possession:
                el.complex.name +
                ' ' +
                el.building.building +
                ' ' +
                el.possession.type +
                ' ' +
                el.possession.address,
              contact: el.contact,
              employee:
                role !== 'citizen' ? el.employee.employee + ' ' + el.employee.competence : 'скрыт',
            }))}
            columns={tableColumns}
            components={components}
            bordered
            pagination={false}
            locale={{
              emptyText: <span className='font-bold text-lg'>Нет данных</span>,
            }}
            rowClassName='table-row'
            onRow={(record) => ({
              onClick: () => {
                showForm(record.number);
              },
            })}
            style={{
              width: 'fit-content',
            }}
          />
        )}
      </div>
    </>
  );
};
