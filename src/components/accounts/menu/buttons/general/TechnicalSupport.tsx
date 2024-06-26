import { FC } from 'react';
import { MdSupportAgent } from 'react-icons/md';

interface IProps {
  changeNeedShowHelpForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TechnicalSupport: FC<IProps> = ({ changeNeedShowHelpForm, changeIsMenuOpened }) => {
  return (
    <button
      className='flex items-center cursor-pointer py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
      onClick={() => {
        changeNeedShowHelpForm(true);
        changeIsMenuOpened(false);
      }}
    >
      <MdSupportAgent className='mr-4 ml-4' />
      <span>Техподдержка</span>
    </button>
  );
};
