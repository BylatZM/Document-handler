import { Button, Checkbox } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';
import { IApplicationNotCitizenColumns } from '../../../../../types';
import { ColumnsType } from 'antd/es/table';
import { defaultNotCitizenColumns } from '../ApplicationTableArgs';
import { defaultNotCitizenOptions } from '../ApplicationTableArgs';

interface IProps {
  needShow: boolean;
  changeNeedShow: React.Dispatch<React.SetStateAction<boolean>>;
  changeNotCitizenTable: React.Dispatch<
    React.SetStateAction<ColumnsType<IApplicationNotCitizenColumns> | null>
  >;
  checkboxValues: null | string[];
  changeCheckboxValues: React.Dispatch<React.SetStateAction<null | string[]>>;
}

export const NotCitizenColumnsForm: FC<IProps> = ({
  needShow,
  changeNeedShow,
  changeNotCitizenTable,
  checkboxValues,
  changeCheckboxValues,
}) => {
  return (
    <div
      className={clsx(
        'transitionGeneral fixed z-30 bottom-0 inset-x-0 m-auto bg-blue-500 backdrop-blur-md bg-opacity-10 flex items-center justify-center overflow-hidden',
        needShow ? 'h-full' : 'h-0',
      )}
    >
      <div className='z-30 bg-blue-700 h-min min-w-[250px] max-w-[250px] sm:min-w-[500px] sm:max-w-[500px] backdrop-blur-md bg-opacity-20 rounded-md p-1 sm:p-5'>
        <span className='text-1xl sm:text-2xl'>Выберите столбцы в таблице</span>
        <div className='mb-4 mt-4'>
          <hr />
          <Checkbox.Group
            value={!checkboxValues ? undefined : checkboxValues}
            className='flex flex-col justify-start mt-1 mb-1'
            options={defaultNotCitizenOptions}
            onChange={(value) => {
              const filter_array = value as string[];
              changeCheckboxValues(filter_array);

              let array: ColumnsType<IApplicationNotCitizenColumns> = [];
              defaultNotCitizenColumns.forEach((el) => {
                if (el.key && filter_array.some((item) => item === el.key)) {
                  array.push(el);
                }
              });
              changeNotCitizenTable(array);
            }}
          />
          <hr />
        </div>
        <div className='text-left mb-4 max-sm:mt-2 text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50 '>
          <span className='text-red-500'>Внимание! </span>Если Вы не сохраните Ваш выбор, то после
          перезагрузки страницы будут отображены все столбцы, вне зависимости от того, какие Вы
          выбирали
        </div>
        <div className='flex gap-2 justify-center'>
          <Button
            className='bg-none text-blue-700 border-blue-700 sm:mr-4'
            onClick={() => changeNeedShow(false)}
          >
            Закрыть
          </Button>
          <Button
            type='primary'
            className='inline bg-blue-700 text-white'
            onClick={() => {
              localStorage.setItem('application_table_columns', JSON.stringify(checkboxValues));
              changeNeedShow(false);
            }}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
