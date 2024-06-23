import { Checkbox, ConfigProvider, Form, UploadFile } from 'antd';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { useEffect } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { FakeFields } from './FakeFields';
import { ICitizenPossession } from '../../../types';
import { requestFromHelpForm } from '../../../../api/requests/Main';
import { RcFile } from 'antd/es/upload';

interface IHelpFormProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  getCitizenPossessions?: () => Promise<ICitizenPossession[] | void>;
}

interface IFinish {
  name: string;
  title: string;
  address?: string;
  contact: string;
  description: string;
}

export const HelpForm: FC<IHelpFormProps> = ({
  needShowForm,
  changeNeedShowForm,
  getCitizenPossessions,
}) => {
  const [isAgreementChecked, changeIsAgreementChecked] = useState(false);
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { error } = useTypedSelector((state) => state.HelpFormReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { helpFormPossessions, helpFormError, helpFormLoading } = useActions();
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isRequestBad, changeIsRequestBad] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (localStorage.getItem('personal_agreement') === null) {
      changeIsAgreementChecked(false);
    } else {
      changeIsAgreementChecked(true);
    }
  }, [needShowForm]);

  const initInfo = async () => {
    if (user.role !== 'citizen' || !getCitizenPossessions) return;
    let possession: ICitizenPossession[] = [];
    if (user.role === 'citizen' && user.is_approved && citizenPossessions[0].id === 0) {
      const response = await getCitizenPossessions();
      if (!response) return;
      possession = response;
    } else {
      possession = citizenPossessions;
    }
    if (possession.length > 0) {
      const poss_processed = possession.map((item) => {
        let possessionType = 'парковка';
        if (item.possession_type === '1') possessionType = 'квартира';
        if (item.possession_type === '2') possessionType = 'офис';
        if (item.possession_type === '4') possessionType = 'кладовка';
        return `${item.complex.name}, ${item.building.address}, [${possessionType}] № ${item.possession.name}`;
      });
      helpFormPossessions(poss_processed);
    }
  };

  useEffect(() => {
    if (!needShowForm) return;
    initInfo();
  }, [needShowForm]);

  const some = async (file: RcFile | undefined): Promise<ArrayBuffer | void> => {
    if (!file) return;
    return await file.arrayBuffer();
  };

  const onFinish = async (values: IFinish) => {
    let data = new FormData();
    fileList.forEach((file) => {
      if (file.thumbUrl && file.originFileObj) {
        data.append('images', file.originFileObj as File, file.name);
      }
    });
    if (error) helpFormError(null);
    helpFormLoading(true);
    data.append('name', values.name.replaceAll(/\s/g, ''));
    data.append('contact', values.contact);
    data.append('title', values.title);
    data.append('description', values.description);
    if (values.address) {
      data.append('address', values.address);
    }
    const response = await requestFromHelpForm(data);
    helpFormLoading(false);
    if (!response) {
      return;
    }
    if (typeof response !== 'number' && 'type' in response) {
      changeIsRequestBad((prev) => !prev);
      helpFormError(response);
      setTimeout(() => {
        changeIsRequestBad((prev) => !prev);
      }, 2000);
      return;
    }
    changeIsRequestSuccess((prev) => !prev);
    setTimeout(() => {
      changeIsRequestSuccess((prev) => !prev);
      changeNeedShowForm(false);
      setFileList([]);
    }, 2000);
  };

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
  };

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-500 bg-opacity-10 backdrop-blur-xl z-50 fixed inset-0 mx-auto flex justify-center items-center overflow-hidden',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div
        className='flex flex-col bg-blue-700 p-4 max-sm:p-2 bg-opacity-10 backdrop-blur-xl rounded-md min-w-[280px] max-w-[280px] sm:min-w-[600px] sm:max-w-[600px] overflow-x-hidden overflow-y-auto relative'
        style={{ maxHeight: 'calc(100vh - 20px)' }}
      >
        <div className='fixed inset-0 flex justify-center items-center z-[-1] m-auto sm:max-w-[280px]'>
          <svg className='w-full h-auto aspect-square' viewBox='0 0 60 47'>
            <g id='surface1'>
              <path
                fill='#d69a9a'
                d='M 23.199219 0.109375 C 23.199219 0.109375 0.0390625 35.429688 0.00390625 35.53125 L 7.691406 46.917969 C 52.707031 46.730469 52.441406 46.917969 52.441406 46.917969 L 54.28125 44.226562 C 55.253906 42.800781 56.164062 41.445312 56.296875 41.242188 C 56.433594 41.027344 56.804688 40.488281 57.121094 40.054688 C 58.484375 38.109375 60 35.796875 60 35.628906 C 60 35.53125 59.226562 34.324219 58.285156 32.933594 C 57.324219 31.542969 56.46875 30.25 56.367188 30.085938 C 56.265625 29.917969 56.0625 29.632812 55.929688 29.480469 C 55.792969 29.3125 54.597656 27.585938 53.304688 25.660156 C 51.992188 23.71875 50.679688 21.808594 50.394531 21.386719 C 50.089844 20.96875 44.925781 13.429688 44.925781 13.429688 L 30.101562 13.511719 L 38.703125 0.109375 Z M 30.101562 13.511719 C 30.101562 13.511719 41.8125 31.007812 44.859375 35.546875 C 44.859375 35.597656 44.859375 35.496094 44.859375 35.546875 C 44.859375 35.597656 44.859375 35.597656 44.859375 35.546875 C 36.714844 35.546875 15.128906 35.597656 15.128906 35.546875 Z M 30.101562 13.511719 '
              />
            </g>
          </svg>
        </div>
        <div className='text-center text-xl font-bold mb-4 max-sm:mb-2'>Обратная связь</div>
        {needShowForm && (
          <Form
            {...formItemLayout}
            name='help_form'
            onFinish={onFinish}
            initialValues={{
              name: user.first_name,
              contact: user.phone ? user.phone : user.email,
            }}
          >
            <Inputs fileList={fileList} setFileList={setFileList} />
            {!isAgreementChecked && (
              <ConfigProvider
                theme={{
                  components: {
                    Checkbox: {
                      colorBorder: '#9fa6b1',
                    },
                  },
                }}
              >
                <Checkbox
                  className='text-left text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50 mb-4'
                  onClick={() => {
                    localStorage.setItem('personal_agreement', 'true');
                    changeIsAgreementChecked(true);
                  }}
                >
                  Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
                  персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года
                  “О персональных данных”"
                </Checkbox>
              </ConfigProvider>
            )}
            <Buttons
              changeNeedShowForm={changeNeedShowForm}
              isAgreementChecked={isAgreementChecked}
              isRequestSuccess={isRequestSuccess}
              isRequestBad={isRequestBad}
              setFileList={setFileList}
            />
          </Form>
        )}
        {!needShowForm && <FakeFields />}
      </div>
    </div>
  );
};
