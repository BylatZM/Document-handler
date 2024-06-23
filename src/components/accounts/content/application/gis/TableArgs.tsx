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
        )}
      >
        {status}
      </div>
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
      <div className='max-w-[200px] max-md:max-h-[50px] max-h-[100px] overflow-hidden leading-[15px]'>
        {applicantComment}
      </div>
    ),
  },
  {
    title: 'Жилищный комплекс',
    dataIndex: 'complex',
    key: 'complex',
    render: (complex: string) => <div className='max-w-[200px]'>{complex}</div>,
  },
  {
    title: 'Адрес здания',
    dataIndex: 'building',
    key: 'building',
    render: (building: string) => (
      <div className='max-w-[200px] max-h-[80px] leading-[15px]'>{building}</div>
    ),
  },
  {
    title: 'Наименование собственности',
    dataIndex: 'possession',
    key: 'possession',
  },
  {
    title: 'Исполнитель',
    dataIndex: 'employee',
    key: 'employee',
    render: (employee: string) => (
      <div className='max-w-[200px] max-md:max-h-[50px] max-h-[100px] overflow-hidden leading-[15px]'>
        {employee}
      </div>
    ),
  },
];
