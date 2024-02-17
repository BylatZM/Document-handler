import { Checkbox, ConfigProvider } from 'antd';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { useEffect } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';

interface IHelpFormProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HelpForm: FC<IHelpFormProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [isAgreementChecked, changeIsAgreementCheckedChecked] = useState(true);
  const possessions = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { processed_possessions, info } = useTypedSelector((state) => state.HelpFormReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { helpFormName, helpFormContact, helpFormPossessions, helpFormAddress } = useActions();

  useEffect(() => {
    if (!needShowForm) return;

    if (!processed_possessions && possessions[0].id !== 0) {
      let poss_processed = null;
      poss_processed = possessions.map((item) => {
        let possessionType = 'парковка';
        if (item.possessionType === '1') possessionType = 'квартира';
        if (item.possessionType === '2') possessionType = 'офис';
        if (item.possessionType === '4') possessionType = 'кладовка';
        return (
          item.complex.name +
          ', ' +
          item.building.address +
          `, ${possessionType}: ` +
          item.possession.address
        );
      });
      helpFormAddress('1');
      helpFormPossessions(poss_processed);
    }
    if (user.first_name && info.name !== user.first_name) {
      helpFormName(user.first_name);
    }

    if (user.phone && info.contact !== user.phone && /^\+\d{11}$/.test(user.phone)) {
      helpFormContact(user.phone);
      return;
    } else if (user.email && info.contact !== user.email) helpFormContact(user.email);
  }, [needShowForm]);

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-500 bg-opacity-10 backdrop-blur-xl z-[30] fixed inset-0 flex justify-center items-center overflow-hidden',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div
        className='flex flex-col bg-blue-700 p-5 bg-opacity-10 backdrop-blur-xl rounded-md min-w-[280px] max-w-[280px] sm:min-w-[600px] sm:max-w-[600px] overflow-x-hidden overflow-y-auto'
        style={{ maxHeight: 'calc(100vh - 20px)' }}
      >
        <div className='text-center'>
          <span className='text-xl font-bold'>Обратная связь</span>
        </div>

        <div className='flex flex-col justify-between h-5/6'>
          <div className='my-5'>
            <Inputs />
          </div>
          <div>
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
                className='text-left text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50 '
                onClick={() => changeIsAgreementCheckedChecked((prev) => !prev)}
              >
                Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
                персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года
                “О персональных данных”"
              </Checkbox>
            </ConfigProvider>
          </div>
          <Buttons
            changeNeedShowForm={changeNeedShowForm}
            isAgreementChecked={isAgreementChecked}
          />
        </div>
      </div>
    </div>
  );
};
