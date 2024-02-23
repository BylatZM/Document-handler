import { Button, Checkbox, CheckboxOptionType, ConfigProvider, Popover } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';
import { IApplicationColumns } from '../../../types';
import { ColumnsType } from 'antd/es/table';

interface IProps {
  needShow: boolean;
  changeNeedShow: React.Dispatch<React.SetStateAction<boolean>>;
  baseColumns: ColumnsType<IApplicationColumns>;
  changeColumns: React.Dispatch<React.SetStateAction<ColumnsType<IApplicationColumns> | null>>;
  checkboxValues: null | string[];
  changeCheckboxValues: React.Dispatch<React.SetStateAction<null | string[]>>;
  options: CheckboxOptionType[];
}

export const ChangeShowingColumns: FC<IProps> = ({
  needShow,
  changeNeedShow,
  baseColumns,
  changeColumns,
  checkboxValues,
  changeCheckboxValues,
  options,
}) => {
  return (
    <div
      className={clsx(
        'transitionGeneral fixed z-20 bottom-0 inset-x-0 m-auto bg-blue-500 backdrop-blur-md bg-opacity-10 flex items-center justify-center overflow-auto',
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
            options={options}
            onChange={(value) => {
              const filter_array = value as string[];
              changeCheckboxValues(filter_array);
              let array: ColumnsType<IApplicationColumns> = [];
              baseColumns.forEach((el) => {
                if (el.key && filter_array.some((item) => item === el.key)) {
                  array.push(el);
                }
              });
              changeColumns(array);
            }}
          />
          <hr />
        </div>
        <div className='flex gap-2 justify-center'>
          <Button
            className='bg-none border-blue-700 border-[1px] text-blue-700 inline sm:mr-4'
            onClick={() => changeNeedShow(false)}
          >
            Закрыть
          </Button>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: undefined,
                },
              },
            }}
          >
            <Popover
              content={
                <div className='w-[200px]'>
                  Если вы не сохраните ваш выбор, то после перезагрузки страницы будут отображены
                  все столбцы, вне зависимости от того, какие вы выбрали
                </div>
              }
            >
              <Button
                className='inline bg-blue-700 text-white'
                onClick={() => {
                  localStorage.setItem('application_table_columns', JSON.stringify(checkboxValues));
                  changeNeedShow(false);
                }}
              >
                Сохранить
              </Button>
            </Popover>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};
