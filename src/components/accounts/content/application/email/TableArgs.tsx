import clsx from 'clsx';
import { IEmailTableColumns } from '../../../../types';
import { ColumnsType } from 'antd/es/table';

export const defaultColumns: ColumnsType<IEmailTableColumns> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'ФИО заявителя',
    dataIndex: 'fio',
    key: 'fio',
  },
  {
    title: 'Контактный телефон',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Электронная почта',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Дата создания',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Тип заявки',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'subtype',
    key: 'subtype',
    render: (subtype) => (
      <div className='overflow-hidden max-w-[150px] text-ellipsis'>{subtype}</div>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <div
        className={clsx(
          'text-white p-2 rounded-lg min-w-[90px]',
          status === 'В работе' && 'bg-blue-700',
          status === 'Новая' && 'bg-green-400',
          status === 'Назначена' && 'bg-green-600',
          status === 'Возвращена' && 'bg-amber-500',
          status === 'Закрыта' && 'bg-red-500',
          status === 'Заведена неверно' && 'bg-gray-500',
        )}
      >
        {status}
      </div>
    ),
  },
  {
    title: 'Дата закрытия',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: 'Краткое содержание',
    dataIndex: 'applicantComment',
    key: 'applicantComment',
    render: (applicantComment: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {applicantComment}
      </div>
    ),
  },
  {
    title: 'Жилищный комплекс',
    dataIndex: 'complex',
    key: 'complex',
    render: (complex: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {complex}
      </div>
    ),
  },
  {
    title: 'Адрес здания',
    dataIndex: 'building',
    key: 'building',
    render: (building: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {building}
      </div>
    ),
  },
  {
    title: 'Наименование собственности',
    dataIndex: 'possession',
    key: 'possession',
  },
  {
    title: 'Сотрудник',
    dataIndex: 'employee',
    key: 'employee',
    render: (employee: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {employee}
      </div>
    ),
  },
];
