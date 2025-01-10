import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';

export const ApplicantComment: FC<{ citizen_comment: string }> = ({ citizen_comment }) => {
  return (
    <div className='mt-2 gap-2 flex flex-col'>
      <span>Описание заявки</span>
      <TextArea
        rows={5}
        maxLength={500}
        value={citizen_comment}
        className='rounded-md h-[60px] text-base'
        disabled
        style={{ resize: 'none' }}
      />
    </div>
  );
};
