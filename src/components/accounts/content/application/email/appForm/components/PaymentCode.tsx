import { FC } from 'react';
import { Input } from 'antd';

export const PaymentCode: FC<{ paymentCode: string }> = ({ paymentCode }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Номер платежного кода</span>
        <Input className='w-full h-[50px] text-base' value={paymentCode} disabled />
      </div>
    </>
  );
};
