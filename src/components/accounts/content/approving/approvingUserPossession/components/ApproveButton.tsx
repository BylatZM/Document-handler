import { Button, ConfigProvider } from 'antd';
import { FC } from 'react';
import {
  IApprovingCitizenPossessionProcessingRow,
  ICitizenPossessionsColumns,
} from '../../../../../types';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  makeUpdateCitizenPossessionStatusBySystem: (
    citizenPossessionId: number,
    newStatusId: '3' | '1',
  ) => Promise<void>;
  processingRow: null | IApprovingCitizenPossessionProcessingRow;
  rowData: ICitizenPossessionsColumns;
}

export const ApproveButton: FC<IProps> = ({
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
          makeUpdateCitizenPossessionStatusBySystem(rowData.key, '3');
        }}
        disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
        className='text-white h-[40px] bg-green-700'
      >
        {processingRow &&
          processingRow.operation === 'loading' &&
          processingRow.row_id === rowData.key &&
          processingRow.button_type === 'approve' && (
            <div>
              <ImSpinner9 className='inline animate-spin mr-2' />
              <span>Обработка</span>
            </div>
          )}
        {processingRow &&
          processingRow.operation === 'success' &&
          processingRow.row_id === rowData.key &&
          processingRow.button_type === 'approve' && (
            <div>
              <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
              <span>Успешно</span>
            </div>
          )}
        {(!processingRow ||
          (processingRow &&
            (processingRow.row_id !== rowData.key ||
              (processingRow.row_id === rowData.key &&
                processingRow.button_type !== 'approve')))) && <>Подтвердить</>}
      </Button>
    </ConfigProvider>
  );
};
