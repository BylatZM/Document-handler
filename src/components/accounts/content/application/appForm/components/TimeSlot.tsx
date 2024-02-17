import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';
import { IApplication, IRole } from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const TimeSlot: FC<IProps> = ({ form_id, role, data, changeFormData }) => {
  return (
    <div className='flex max-md:flex-col max-md:flex-nowrap flex-wrap gap-y-2 justify-between'>
      {form_id !== 0 && (
        <>
          <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
            <span>Плановое время начала работ</span>
            <Input value={!data.creatingDate ? '' : data.creatingDate} disabled />
          </div>
          <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
            <span>Плановое время окончания работ</span>
            <Input value={!data.dueDate ? '' : data.dueDate} disabled />
          </div>
        </>
      )}
      {((role.role === 'citizen' && form_id !== 0) || role.role !== 'citizen') && (
        <>
          <div className='flex flex-col gap-y-2 w-full'>
            <span>Комментарий диспетчера</span>
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
          <div className='flex flex-col gap-2 w-full'>
            <span>Комментарий исполнителя</span>
            <TextArea
              value={!data.employeeComment ? '' : data.employeeComment}
              onChange={(e) =>
                changeFormData((prev) => ({ ...prev, employeeComment: e.target.value }))
              }
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
        </>
      )}
    </div>
  );
};
