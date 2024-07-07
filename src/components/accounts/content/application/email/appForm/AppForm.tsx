import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { IAddingFile, IEmailApplication, IEmployee, ISubtype, IType } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useLogout } from '../../../../../hooks/useLogout';
import { Status } from './components/Status';
import { Type } from './components/Type';
import { ApplicantComment } from './components/ApplicantComment';
import { Priority } from './components/Priority';
import { Possession } from './components/Possession';
import { TimeSlot } from './components/TimeSlot';
import { Employee } from './components/Employee';
import { Buttons } from './components/Buttons';
import { ApplicantFio } from './components/ApplicantFio';
import { DefaultAppForm } from './DefaultAppForm';
import { Phone } from './components/Phone';
import { Email } from './components/Email';
import { Complex } from './components/Complex';
import { Building } from './components/Building';
import { Subtype } from './components/Subtype';
import { PaymentCode } from './components/PaymentCode';
import { Modal } from 'antd';
import { PlayerPDF } from '../../PlayerPDF';

interface IProps {
  emailApplication: IEmailApplication | null;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  changeSelectedItem: React.Dispatch<React.SetStateAction<IEmailApplication | null>>;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  getTypesByComplexId: (complex_id: string) => Promise<IType[] | void>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  isFileGood: (file: File, fileStorage: IAddingFile[]) => boolean;
  getBase64: (file: File) => Promise<string>;
}

export const AppForm: FC<IProps> = ({
  emailApplication,
  changeIsNeedToGet,
  changeSelectedItem,
  applicationFreshnessStatus,
  getEmploys,
  getTypesByComplexId,
  getSubtypes,
  isFileGood,
  getBase64,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { employs, priorities, error, types, isLoading, subtypes } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes } = useTypedSelector((state) => state.PossessionReducer);
  const { applicationError } = useActions();
  const [addingEmployeeFiles, setAddingEmployeeFiles] = useState<IAddingFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFileType, setPreviewFileType] = useState<'image' | 'document' | null>(null);
  const [previewFile, setPreviewFile] = useState<string | File | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const [FormData, changeFormData] = useState<IEmailApplication>(DefaultAppForm);

  const initDispatcherForm = async (data: IEmailApplication) => {
    if (role !== 'dispathcer') return;

    if (['Назначена', 'Возвращена'].some((el) => el === data.status.name)) {
      if (!types.some((el) => el.id === data.type?.id)) {
        const complex = data.complex;
        if (!complex) return;

        await getTypesByComplexId(complex.id.toString());
      }
      if (!subtypes.some((el) => el.id === data.subtype?.id)) {
        const complex = data.complex;
        const type = data.type;
        if (!complex || !type) return;
        await getSubtypes(type.id.toString(), complex.id.toString());
      }
      if (!employs.some((el) => el.id === data.employee?.id)) {
        const complex = data.complex;
        const subtype = data.subtype;
        if (!complex || !subtype) return;
        await getEmploys(complex.id.toString(), subtype.id.toString());
      }
    }
  };

  useEffect(() => {
    if (!emailApplication || !['dispatcher', 'executor'].some((el) => role === el)) return;
    changeFormData(emailApplication);
    initDispatcherForm(emailApplication);
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [emailApplication]);

  const exitFromForm = () => {
    changeSelectedItem(null);
    setAddingEmployeeFiles([]);
    if (error) applicationError(null);
  };

  const showFile = async (file: File | string) => {
    if (typeof file === 'string') {
      if (file.split('.')[file.split('.').length - 1] === 'pdf') {
        setPreviewFileType('document');
      } else {
        setPreviewFileType('image');
      }
      setPreviewFile(file);
      setPreviewTitle(file.split('/')[file.split('/').length - 1]);
    } else {
      if (file.type === 'application/pdf') {
        setPreviewFile(file);
        setPreviewFileType('document');
      } else {
        const loadedFile = await getBase64(file);
        setPreviewFile(loadedFile as string);
        setPreviewFileType('image');
      }
      setPreviewTitle(file.name);
    }
    setPreviewOpen(true);
  };

  const handleCancel = () => {
    setPreviewFile(null);
    setPreviewTitle('');
    setPreviewOpen(false);
    setPreviewFileType(null);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral fixed h-full inset-y-0 right-0 bg-opacity-10 bg-blue-700 backdrop-blur-xl flex justify-center items-center overflow-hidden z-50',
        emailApplication ? 'w-full' : 'w-0',
      )}
    >
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <div>
          {typeof previewFile === 'string' && previewFileType === 'image' && (
            <img
              alt='выбранное изображение'
              className='h-auto max-sm:h-3/4 w-[30rem] max-sm:w-auto m-auto'
              src={previewFile}
            />
          )}
          {previewFileType === 'document' && <PlayerPDF propsFile={previewFile} />}
        </div>
      </Modal>
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
            <Complex
              role={role}
              data={FormData}
              complexes={complexes}
              changeFormData={changeFormData}
              error={error}
              getTypesByComplexId={getTypesByComplexId}
            />
            <Building building_address={FormData.building_address} />
            <Possession possession={FormData.possession} />
            <PaymentCode paymentCode={FormData.payment_code} />
            <ApplicantFio applicant_fio={FormData.applicant_fio} />
            <Phone phone={FormData.phone} />
            <Email email={FormData.email} />
          </div>
          <span className='font-bold text-lg'>Сведения</span>
          <div className='flex flex-col md:flex-wrap md:flex-row justify-between gap-4'>
            <Status status={FormData.status} />
            <Type
              role={role}
              data={FormData}
              types={types}
              changeFormData={changeFormData}
              getSubtypes={getSubtypes}
              error={error}
              applicationLoadingField={isLoading}
            />
            <Subtype
              data={FormData}
              changeData={changeFormData}
              subtypes={subtypes}
              role={role}
              error={error}
              getEmploys={getEmploys}
              applicationLoadingField={isLoading}
            />
          </div>
          <ApplicantComment applicant_comment={FormData.applicant_comment} />
          <Priority
            role={role}
            data={FormData}
            priorities={priorities}
            changeFormData={changeFormData}
          />
          <TimeSlot
            role={role}
            data={FormData}
            changeData={changeFormData}
            error={error}
            form_id={FormData.id}
            applicationFreshnessStatus={applicationFreshnessStatus}
            employee_files={FormData.employee_files}
            getBase64={getBase64}
            isFileGood={isFileGood}
            setAddingEmployeeFiles={setAddingEmployeeFiles}
            addingEmployeeFiles={addingEmployeeFiles}
            showFile={showFile}
          />
          <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
            <span className='font-bold text-lg'>Исполнители</span>
            <Employee
              role={role}
              data={FormData}
              workers={employs}
              changeFormData={changeFormData}
            />
          </div>
          <Buttons
            data={FormData}
            setData={changeFormData}
            role={role}
            exitFromForm={exitFromForm}
            logout={logout}
            changeIsNeedToGet={changeIsNeedToGet}
            addingEmployeeFiles={addingEmployeeFiles}
          />
        </div>
      </div>
    </div>
  );
};
