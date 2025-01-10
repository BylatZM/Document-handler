import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { IOpenKazanApplication } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useLogout } from '../../../../../hooks/useLogout';
import { Status } from './components/Status';
import { Type } from './components/Type';
import { ApplicantComment } from './components/ApplicantComment';
import { Possession } from './components/Possession';
import { TimeSlot } from './components/TimeSlot';
import { Employee } from './components/Employee';
import { Buttons } from './components/Buttons';
import { ApplicantFio } from './components/ApplicantFio';
import { DefaultAppForm } from './DefaultAppForm';
import { Phone } from './components/Phone';
import { Building } from './components/Building';
import { Subtype } from './components/Subtype';

interface IProps {
  openKazanApplication: IOpenKazanApplication | null;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IOpenKazanApplication | null>>;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
}

export const AppForm: FC<IProps> = ({
  openKazanApplication,
  changeIsNeedToGet,
  changeSelectedItem,
  applicationFreshnessStatus,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { error } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { applicationError } = useActions();

  const [FormData, changeFormData] = useState<IOpenKazanApplication>(DefaultAppForm);

  useEffect(() => {
    if (!openKazanApplication || !['dispatcher', 'executor'].some((el) => role === el)) return;
    changeFormData(openKazanApplication);
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [openKazanApplication]);

  const exitFromForm = () => {
    changeSelectedItem(null);
    if (error) applicationError(null);
    changeIsNeedToGet(true);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed h-full inset-y-0 right-0 bg-opacity-10 bg-blue-700 backdrop-blur-xl flex justify-center items-center overflow-hidden z-50',
        openKazanApplication ? 'w-full' : 'w-0',
      )}
    >
      <div
        ref={ref}
        className={clsx(
          'max-sm:min-w-[280px] max-sm:overflow-x-auto sm:min-w-[600px] sm:max-w-[600px] md:min-w-[700px] md:max-w-[700px] lg:min-w-[850px] lg:max-w-[850px] h-auto max-h-[95%] backdrop-blur-xl rounded-md p-5 overflow-y-auto',
          applicationFreshnessStatus === 'warning' && 'bg-amber-700 bg-opacity-50',
          applicationFreshnessStatus === 'expired' && 'bg-red-700 bg-opacity-40',
          applicationFreshnessStatus === 'fresh' && 'bg-blue-700 bg-opacity-30',
        )}
      >
        <div className='flex justify-center gap-4 flex-col disable'>
          <span className='font-bold text-lg mt-4'>Объект исполнения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 justify-between mt-2'>
            <Building building_address={FormData.building_address} />
            <Possession possession={FormData.possession} />
            <ApplicantFio applicant_fio={FormData.applicant_fio} />
            <Phone phone={FormData.contact} />
          </div>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Status status={FormData.status} />
            <Type
              type_name={FormData.type_name}
            />
            <Subtype
              subtype_name={FormData.subtype_name}
            />
          </div>
          <ApplicantComment citizen_comment={FormData.applicant_comment} />
          <TimeSlot data={FormData}/>
          <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
            <span className='font-bold text-lg'>Исполнители</span>
            <Employee
              employee_name={FormData.employee_name}
            />
          </div>
          <Buttons data={FormData} role={role} exitFromForm={exitFromForm} logout={logout} />
        </div>
      </div>
    </div>
  );
};
