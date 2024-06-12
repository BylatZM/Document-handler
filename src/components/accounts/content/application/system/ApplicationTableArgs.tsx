import clsx from 'clsx';
import { IApplicationCitizenColumns, IApplicationNotCitizenColumns } from '../../../../types';
import { ColumnsType } from 'antd/es/table';
import { CheckboxOptionType } from 'antd';

export const defaultCitizenColumns: ColumnsType<IApplicationCitizenColumns> = [
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
    dataIndex: 'appType',
    key: 'appType',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'appSubtype',
    key: 'appSubtype',
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
    render: (possession: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possession}
      </div>
    ),
  },
];

export const defaultCitizenOptions = defaultCitizenColumns.map(({ key, title }) => ({
  label: title,
  value: key,
})) as CheckboxOptionType[];

export const defaultNotCitizenColumns: ColumnsType<IApplicationNotCitizenColumns> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Заявку создал',
    dataIndex: 'creator',
    key: 'creator',
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
    title: 'Дата создания',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Тип заявки',
    dataIndex: 'appType',
    key: 'appType',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'appSubtype',
    key: 'appSubType',
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
    title: 'Тип собственности',
    dataIndex: 'possessionType',
    key: 'possessionType',
  },
  {
    title: 'Наименование собственности',
    dataIndex: 'possessionNumber',
    key: 'possessionNumber',
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

export const defaultNotCitizenOptions = defaultNotCitizenColumns.map(({ key, title }) => ({
  label: title,
  value: key,
})) as CheckboxOptionType[];
