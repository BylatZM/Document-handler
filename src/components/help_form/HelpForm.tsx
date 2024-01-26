import { Checkbox, ConfigProvider } from 'antd';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useActions } from '../hooks/useActions';

interface IHelpFormProps {
  activeForm: null | 'password' | 'help';
  changeActiveForm: (activeForm: null | 'help') => void;
}

export const HelpForm: FC<IHelpFormProps> = ({ activeForm, changeActiveForm }) => {
  const [isAgrChecked, changeIsAgr] = useState(true);
  const possessions = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { processed_possessions, info } = useTypedSelector((state) => state.HelpFormReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { helpFormName, helpFormContact, helpFormPossessions, helpFormAddress } = useActions();

  useEffect(() => {
    if (activeForm !== 'help') return;

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

    if (user.phone && info.contact !== user.phone && user.phone.length === 11) {
      helpFormContact(user.phone);
      return;
    }
    if (user.email && info.contact !== user.email) helpFormContact(user.email);
  }, [activeForm]);

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-700 p-5 bg-opacity-10 backdrop-blur-xl z-[40] fixed inset-0 m-auto rounded-md w-[600px] h-[500px] overflow-y-auto border-solid border-blue-500 border-2',
        activeForm === 'help' ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
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
              onClick={() => changeIsAgr(!isAgrChecked)}
            >
              Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
              персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года “О
              персональных данных”"
            </Checkbox>
          </ConfigProvider>
        </div>
        <Buttons changeActiveForm={changeActiveForm} isAgrChecked={isAgrChecked} />
      </div>
    </div>
  );
};
