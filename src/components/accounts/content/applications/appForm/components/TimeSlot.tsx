import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';
import { IApplication, IRole } from '../../../../../types';

interface IProps {
  role: IRole;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const TimeSlot: FC<IProps> = ({ role, data, changeFormData }) => {
  return (
    <div className='flex flex-wrap gap-2 mt-2 justify-between'>
      <div className='flex flex-col gap-2 w-[48%]'>
        <span>Плановое время начала работ</span>
        <Input value={!data.creatingDate ? '' : data.creatingDate} disabled />
      </div>
      <div className='flex flex-col gap-2 w-[48%]'>
        <span>Плановое время окончания работ</span>
        <Input value={!data.dueDate ? '' : data.dueDate} disabled />
      </div>
      <div className='flex flex-col gap-2 w-full mt-6'>
        <span>Комментарий управ. компании</span>
        <TextArea
          value={!data.dispatcherComment ? '' : data.dispatcherComment}
          onChange={(e) =>
            changeFormData((prev) => ({ ...prev, dispatcherComment: e.target.value }))
          }
          className='rounded-md h-[60px]'
          maxLength={500}
          rows={5}
          style={{ resize: 'none' }}
          disabled={
            ['citizen', 'executor'].some((el) => el === role.role) ||
            (data.status && data.status.appStatus === 'Закрыта')
              ? true
              : false
          }
        />
      </div>
      <div className='flex flex-col gap-2 w-full mt-6'>
        <span>Комментарий исполнителя</span>
        <TextArea
          value={!data.employeeComment ? '' : data.employeeComment}
          onChange={(e) => changeFormData((prev) => ({ ...prev, employeeComment: e.target.value }))}
          className='rounded-md h-[60px]'
          maxLength={500}
          rows={5}
          style={{ resize: 'none' }}
          disabled={
            ['citizen', 'dispatcher'].some((el) => el === role.role) ||
            (data.status && data.status.appStatus !== 'В работе')
              ? true
              : false
          }
        />
      </div>
    </div>
  );
};
