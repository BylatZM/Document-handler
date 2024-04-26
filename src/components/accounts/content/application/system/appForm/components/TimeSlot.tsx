import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';
import { IApplication, IError, IRole } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  error: IError | null;
}

export const TimeSlot: FC<IProps> = ({ form_id, role, data, changeFormData, error }) => {
  const { applicationError } = useActions();
  const dateCalculator = (days: number, creatingDate: string): string => {
    const [dmy, hms] = creatingDate.split(' ');
    const currentDate = new Date(`${dmy.split('.').reverse().join('-')}T${hms}`);
    const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    const newDateStr = `
    ${futureDate.getDate() < 10 ? `0${futureDate.getDate()}` : futureDate.getDate()}.${
      futureDate.getMonth() + 1 < 10 ? `0${futureDate.getMonth() + 1}` : futureDate.getMonth() + 1
    }.${futureDate.getFullYear()} ${
      futureDate.getHours() < 10 ? `0${futureDate.getHours()}` : futureDate.getHours()
    }:${futureDate.getMinutes() < 10 ? `0${futureDate.getMinutes()}` : futureDate.getMinutes()}:${
      futureDate.getSeconds() < 10 ? `0${futureDate.getSeconds()}` : futureDate.getSeconds()
    }`.trim();

    return newDateStr;
  };

  return (
    <div className='flex max-md:flex-col max-md:flex-nowrap flex-wrap gap-y-2 justify-between'>
      {form_id !== 0 && (
        <>
          <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
            <span>Плановое время поступления заявки</span>
            <Input className='h-[50px] text-base' value={data.creatingDate} disabled />
          </div>
          <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
            <span>Фактическое время исполнения</span>
            <Input
              className='h-[50px] text-base'
              value={!data.dueDate ? '' : data.dueDate}
              disabled
            />
          </div>
        </>
      )}
      {form_id !== 0 && role !== 'citizen' && (
        <>
          <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
            <span>Заявка была создана</span>
            <Input
              className='h-[50px] text-base'
              value={data.user.role === 'citizen' ? 'Жителем' : 'Диспетчером'}
              disabled
            />
          </div>
          <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
            <span>Плановое время исполнения</span>
            <Input
              className='h-[50px] text-base'
              value={dateCalculator(data.subtype.normative / 24, data.creatingDate)}
              disabled
            />
          </div>
        </>
      )}
      {form_id !== 0 && role === 'citizen' && (
        <>
          <>
            <span>Плановое время выполнения</span>
            <Input
              className='h-[50px] text-base'
              value={dateCalculator(data.subtype.normative / 24, data.creatingDate)}
              disabled
            />
          </>
        </>
      )}
      {((role === 'citizen' && form_id !== 0) || role !== 'citizen') && (
        <>
          <div className='flex flex-col gap-y-2 w-full'>
            <span>Комментарий диспетчера</span>
            <TextArea
              value={!data.dispatcherComment ? '' : data.dispatcherComment}
              onChange={(e) =>
                changeFormData((prev) => ({ ...prev, dispatcherComment: e.target.value }))
              }
              className='rounded-md h-[60px] text-base'
              maxLength={500}
              rows={5}
              style={{ resize: 'none' }}
              disabled={
                ['citizen', 'executor'].some((el) => el === role) ||
                data.status.appStatus === 'Закрыта'
                  ? true
                  : false
              }
            />
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <span>Комментарий исполнителя</span>
            <TextArea
              value={!data.employeeComment ? '' : data.employeeComment}
              onChange={(e) => {
                if (error && error.type === 'employeeComment') applicationError(null);
                changeFormData((prev) => ({ ...prev, employeeComment: e.target.value }));
              }}
              className='rounded-md h-[60px] text-base'
              maxLength={500}
              rows={5}
              style={{ resize: 'none' }}
              status={error && error.type === 'employeeComment' ? 'error' : undefined}
              disabled={
                ['citizen', 'dispatcher'].some((el) => el === role) ||
                data.status.appStatus !== 'В работе'
                  ? true
                  : false
              }
            />
            {error && error.type === 'employeeComment' && (
              <span className='errorText'>{error.error}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
