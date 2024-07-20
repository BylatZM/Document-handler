import { IoMdEye } from 'react-icons/io';
import { FaTrashCan } from 'react-icons/fa6';
import { useRef, useState, useEffect, FC } from 'react';
import pdfPhoto from '../../../../../../../assets/images/pdf-photo.png';
import { IAddingFile, IFile, IStatus } from '../../../../../../types';
import { PlusOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { Popover } from 'antd';
import { GoQuestion } from 'react-icons/go';

interface IProps {
  filesURL: IFile[];
  application_status: IStatus;
  applicationFreshnessStatus: 'fresh' | 'warning' | 'expired';
  getBase64: (file: File) => Promise<string>;
  isFileGood: (file: File, fileStorage: IAddingFile[]) => boolean;
  addingEmployeeFiles: IAddingFile[];
  setAddingEmployeeFiles: React.Dispatch<React.SetStateAction<IAddingFile[]>>;
  showFile: (file: File | string) => Promise<void>;
  role: string;
}

export const EmployeeFiles: FC<IProps> = ({
  filesURL,
  application_status,
  applicationFreshnessStatus,
  getBase64,
  isFileGood,
  addingEmployeeFiles,
  setAddingEmployeeFiles,
  showFile,
  role,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [responseURL, setResponseURL] = useState<IFile[][]>([]);

  useEffect(() => {
    if (!filesURL.length) setResponseURL([]);
    else {
      let array: IFile[][] = [];
      let processed_date: string[] = [];
      filesURL.forEach((item) => {
        if (!processed_date.some((el) => el === item.created_date)) {
          array.push([]);
          processed_date.push(item.created_date);
          filesURL.forEach((val) => {
            if (val.created_date === item.created_date) {
              array[array.length - 1].push(val);
            }
          });
        }
      });
      setResponseURL(array);
    }
  }, [filesURL]);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (isFileGood(file, addingEmployeeFiles)) {
      addFileItemInState(file);
    }
  };

  const addFileItemInState = async (file: File) => {
    if (file.type.split('/')[file.type.split('/').length - 1] === 'pdf') {
      setAddingEmployeeFiles((prev) => [
        ...prev,
        {
          file: file,
          url: '',
        },
      ]);
    } else {
      const fileURL = await getBase64(file);
      setAddingEmployeeFiles((prev) => [
        ...prev,
        {
          file: file,
          url: fileURL,
        },
      ]);
    }
  };
  const pasteEventHandler = async (event: ClipboardEvent) => {
    if (event.clipboardData) {
      var items = event.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('pdf') !== -1) {
            const file = items[i].getAsFile();
            if (!file) return;
            if (isFileGood(file, addingEmployeeFiles)) {
              addFileItemInState(file);
            }
            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      pasteEventHandler(event);
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [addingEmployeeFiles]);

  return (
    <div className='w-full gap-2 flex flex-col'>
      <div className='flex gap-x-2 items-center'>
        <span>Файлы исполнителя</span>
        {application_status.name === 'В работе' && role === 'executor' && (
          <Popover
            content={
              <ul className='list-inside list-disc'>
                <li>Загрузить можно не больше 3 файлов</li>
                <li>Размер файла не может превышать 2 Мегабайта</li>
                <li>Допустимым расширением файла считается png, jpg, jpeg и pdf</li>
              </ul>
            }
          >
            <GoQuestion />
          </Popover>
        )}
      </div>
      <input
        type='file'
        accept='image/png, image/jpg, image/jpeg, application/pdf'
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
      {application_status.name === 'В работе' && role === 'executor' && (
        <div className='flex gap-x-2 mb-4'>
          {addingEmployeeFiles.length < 3 && (
            <button
              onClick={() => onButtonClick()}
              className='transitionFast max-w-[100px] min-w-[100px] aspect-square flex justify-center items-center flex-col border-dashed border-[1px] border-black text-black rounded-md hover:border-opacity-60 hover:text-opacity-60'
            >
              <PlusOutlined />
              <span>Загрузить</span>
            </button>
          )}
          {addingEmployeeFiles.map((item, index) => (
            <div
              key={index}
              className='relative overflow-hidden max-w-[100px] min-w-[100px] aspect-square border-dashed border-[1px] text-sm border-black rounded-md'
            >
              <div className='absolute inset-0 flex justify-center bottom-2 items-center m-auto text-sm text-black text-center'>
                {
                  <img
                    alt='маленькое изображение'
                    src={
                      item.file.type.split('/')[item.file.type.split('/').length - 1] === 'pdf'
                        ? pdfPhoto
                        : item.url
                    }
                    className='w-auto h-3/4'
                  />
                }
              </div>
              <div className='absolute border-dashed border-top-[1px] border-black bottom-0 inset-x-0 flex gap-x-4 justify-center items-center'>
                <button
                  onClick={() => showFile(item.file)}
                  className='transitionFast text-black hover:text-white text-lg'
                >
                  <IoMdEye />
                </button>
                <button
                  onClick={() =>
                    setAddingEmployeeFiles((prev) => [...prev.filter((f, ind) => ind !== index)])
                  }
                  className='transitionFast text-black hover:text-white'
                >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='flex flex-wrap gap-4 mt-4 max-sm:gap-1'>
        {responseURL.map((item, ind) => (
          <div
            key={ind}
            className={clsx(
              'relative flex gap-2 p-2 max-sm:flex-wrap max-sm:gap-1 max-sm:p-1 backdrop-blur-md bg-opacity-50 rounded-md',
              applicationFreshnessStatus === 'warning' && 'bg-amber-300',
              applicationFreshnessStatus === 'expired' && 'bg-red-300',
              applicationFreshnessStatus === 'fresh' && 'bg-blue-300',
            )}
          >
            <span className='absolute top-[-20px] text-xs'>{item[0].created_date}</span>
            {item.map((el, index) => (
              <div
                key={index}
                className='relative overflow-hidden max-w-[100px] min-w-[100px] aspect-square border-dashed border-[1px] text-sm border-black rounded-md'
              >
                <div className='absolute inset-0 bottom-2 flex justify-center items-center m-auto text-sm text-black text-center'>
                  {
                    <img
                      alt='маленькое изображение'
                      src={el.name.split('.')[1] === 'pdf' ? pdfPhoto : el.url}
                      className='w-auto h-3/4'
                    />
                  }
                </div>
                <div className='absolute border-dashed inset-x-0 flex justify-center bottom-0 items-center'>
                  <button
                    onClick={() => showFile(el.url)}
                    className='transitionFast text-black hover:text-white text-lg'
                  >
                    <IoMdEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
