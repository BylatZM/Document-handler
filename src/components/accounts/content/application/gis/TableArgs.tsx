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
    dataIndex: 'creating_date',
    key: 'creating_date',
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
    title: 'ФИО заявителя',
    dataIndex: 'applicant_fio',
    key: 'applicant_fio',
    render: (applicant_fio: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {applicant_fio}
      </div>
    ),
  },
  {
    title: 'Время закрытия',
    dataIndex: 'due_date',
    key: 'due_date',
  },
  {
    title: 'Краткое содержание',
    dataIndex: 'applicant_сomment',
    key: 'applicant_сomment',
    render: (applicant_сomment: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {applicant_сomment}
      </div>
    ),
  },
  {
    title: 'Адрес собственности',
    dataIndex: 'possession_address',
    key: 'possession_address',
    render: (possession_address: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possession_address}
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
