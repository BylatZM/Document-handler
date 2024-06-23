import { Button, ConfigProvider } from 'antd';
import { FC } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';
import { ImSpinner9 } from 'react-icons/im';
import {
  IApprovingCitizenPossessionProcessingRow,
  ICitizenPossessionsColumns,
} from '../../../../../types';

interface IProps {
  makeUpdateCitizenPossessionStatusBySystem: (
    citizenPossessionId: number,
    newStatusId: '3' | '1',
  ) => Promise<void>;
  processingRow: null | IApprovingCitizenPossessionProcessingRow;
  rowData: ICitizenPossessionsColumns;
}

export const RejectButton: FC<IProps> = ({
  makeUpdateCitizenPossessionStatusBySystem,
  processingRow,
  rowData,
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimaryHover: undefined,
          },
        },
      }}
    >
      <Button
        type='primary'
        onClick={() => {
          makeUpdateCitizenPossessionStatusBySystem(rowData.key, '1');
        }}
        disabled={
          rowData.status === 'Отклонена' || (processingRow && processingRow.row_id === rowData.key)
            ? true
            : false
        }
        className='text-white h-[40px] bg-red-700'
      >
        {processingRow &&
          processingRow.operation === 'loading' &&
          processingRow.row_id === rowData.key &&
          processingRow.button_type === 'reject' && (
            <div>
              <ImSpinner9 className='inline animate-spin mr-2' />
              <span>Обработка</span>
            </div>
          )}
        {processingRow &&
          processingRow.operation === 'success' &&
          processingRow.row_id === rowData.key &&
          processingRow.button_type === 'reject' && (
            <div>
              <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
              <span>Успешно</span>
            </div>
          )}
        {(!processingRow ||
          (processingRow &&
            (processingRow.row_id !== rowData.key ||
              (processingRow.row_id === rowData.key &&
                processingRow.button_type !== 'reject')))) && <>Отклонить</>}
      </Button>
    </ConfigProvider>
  );
};
