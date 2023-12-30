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
  const { processed_possessions } = useTypedSelector((state) => state.HelpFormReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { helpFormInit } = useActions();

  useEffect(() => {
    if (!activeForm && !processed_possessions && user.email) {
      let poss_processed = null;
      if (possessions[0].id !== 0) {
        poss_processed = possessions.map((item) => {
          let possessionType = 'парковка';
          if (item.ownershipType === '1') possessionType = 'квартира';
          if (item.ownershipType === '2') possessionType = 'офис';
          if (item.ownershipType === '4') possessionType = 'кладовка';
          return (
            item.complex.name +
            ', ' +
            item.building.address +
            ', собственность: ' +
            item.possession.address +
            ` [${possessionType}]`
          );
        });
      }
      helpFormInit({ email: user.email, name: user.first_name, posses: poss_processed });
    }
  }, [activeForm]);

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-700 overflow-x-hidden p-5 bg-opacity-10 backdrop-blur-xl z-[40] fixed inset-0 m-auto rounded-md w-[500px] h-[500px] overflow-y-auto border-solid border-blue-500 border-2',
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
