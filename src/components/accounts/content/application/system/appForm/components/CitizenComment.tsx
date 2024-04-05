import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';
import { IApplication } from '../../../../../../types';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const CitizenComment: FC<IProps> = ({ form_id, data, changeFormData }) => {
  return (
    <div className='mt-2 gap-2 flex flex-col'>
      <span>Описание заявки</span>
      <TextArea
        rows={5}
        maxLength={500}
        value={data.citizenComment}
        onChange={(e) => changeFormData((prev) => ({ ...prev, citizenComment: e.target.value }))}
        className='rounded-md h-[60px] text-base'
        disabled={form_id > 0 ? true : false}
        style={{ resize: 'none' }}
      />
    </div>
  );
};
