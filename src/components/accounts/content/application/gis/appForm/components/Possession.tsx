import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';

export const Possession: FC<{ possession: string }> = ({ possession }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>Собственность</span>
      <TextArea
        value={possession}
        className='rounded-md text-base'
        rows={2}
        style={{ resize: 'none' }}
        disabled
      />
    </div>
  );
};
