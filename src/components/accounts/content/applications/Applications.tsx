import { Button, ConfigProvider, Popover, Table } from 'antd';
import { AppForm } from './appForm/AppForm';
import clsx from 'clsx';
import { useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { ColumnsType } from 'antd/es/table';

type TypeColumn = {
  number: number;
  creating_date: string;
  app_type: string;
  complex: string;
  status: string;
};

export const Applications = () => {
  const [IsFormActive, changeIsFormActive] = useState(false);
  const { userApplication } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState(0);
  const role = useTypedSelector((state) => state.UserReducer.user.role.role);

  const columns: ColumnsType<TypeColumn> = [
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
      title: 'Жилищный комплекс',
      dataIndex: 'complex',
      key: 'complex',
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
  ];

  const components = {
    header: {
      cell: (props: { children: React.ReactNode }) => (
        <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>{props.children}</th>
      ),
    },
  };

  const showForm = async (application_id: number) => {
    changeSelectedItem(application_id);
    changeIsFormActive(true);
  };

  return (
    <>
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          IsFormActive ? 'w-full' : 'w-0',
        )}
      ></div>
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
          {['citizen', 'dispatcher'].some((el) => el === role) && (
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimaryHover: '#fff',
                  },
                },
              }}
            >
              <Popover content='Создать заявку'>
                <Button
                  className='w-[30px] h-[30px] rounded-full border-none bg-blue-700 text-white flex items-center justify-center'
                  onClick={() => showForm(0)}
                >
                  +
                </Button>
              </Popover>
            </ConfigProvider>
          )}
        </div>

        <Table
          dataSource={userApplication.map((el) => ({
            number: el.id,
            creating_date: !el.creatingDate ? '' : el.creatingDate,
            app_type: el.type.appType,
            complex: el.complex.name,
            status: !el.status ? '' : el.status.appStatus,
          }))}
          columns={columns}
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
            width: '800px',
          }}
        />
      </div>
    </>
  );
};
