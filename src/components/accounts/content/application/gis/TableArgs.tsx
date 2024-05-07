import clsx from 'clsx';
import { IGisTableColumns } from '../../../../types';
import { ColumnsType } from 'antd/es/table';

export const defaultColumns: ColumnsType<IGisTableColumns> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
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
    title: 'Адрес собственности',
    dataIndex: 'possessionAddress',
    key: 'possessionAddress',
    render: (possessionAddress: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possessionAddress}
      </div>
    ),
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Адрес электронной почты',
    dataIndex: 'email',
    key: 'email',
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
