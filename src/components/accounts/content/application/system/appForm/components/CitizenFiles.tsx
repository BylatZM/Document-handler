import { IoMdEye } from 'react-icons/io';
import { FaTrashCan } from 'react-icons/fa6';
import { useRef, useEffect, FC } from 'react';
import pdfPhoto from '../../../../../../../assets/images/pdf-photo.png';
import { IAddingFile, IFile } from '../../../../../../types';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { GoQuestion } from 'react-icons/go';

interface IProps {
  form_id: number;
  responseFilesURL: IFile[];
  getBase64: (file: File) => Promise<string>;
  isFileGood: (file: File, fileStorage: IAddingFile[]) => boolean;
  addingCitizenFiles: IAddingFile[];
  setAddingCitizenFiles: React.Dispatch<React.SetStateAction<IAddingFile[]>>;
  showFile: (file: File | string) => Promise<void>;
}

export const CitizenFiles: FC<IProps> = ({
  form_id,
  responseFilesURL,
  getBase64,
  isFileGood,
  addingCitizenFiles,
  setAddingCitizenFiles,
  showFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (isFileGood(file, addingCitizenFiles)) {
      addFileItemInState(file);
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
            if (isFileGood(file, addingCitizenFiles)) {
              addFileItemInState(file);
            }
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
  }, [addingCitizenFiles]);

  const addFileItemInState = async (file: File) => {
    if (file.type.split('/')[file.type.split('/').length - 1] === 'pdf') {
      setAddingCitizenFiles((prev) => [
        ...prev,
        {
          file: file,
          url: '',
        },
      ]);
    } else {
      const fileURL = await getBase64(file);
      setAddingCitizenFiles((prev) => [
        ...prev,
        {
          file: file,
          url: fileURL,
        },
      ]);
    }
  };

  return (
    <div className='w-full gap-2 flex flex-col'>
      <div className='flex gap-x-2 items-center'>
        {form_id < 1 && <span>Прикрепить файл(-ы)</span>}
        {form_id > 0 && <span>Файлы жителя</span>}
        {form_id < 1 && (
          <Popover
            overlayClassName='bg-none'
            color='rgba(0, 0, 0, 0.85)'
            overlayInnerStyle={{ background: 'rgba(0, 0, 0, 0.85)', width: '250px' }}
            content={
              <ul className='list-inside list-disc text-gray-200'>
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
      <div className='flex flex-wrap gap-2 max-sm:gap-1'>
        {form_id < 1 && addingCitizenFiles.length < 3 && (
          <button
            onClick={() => onButtonClick()}
            className='transitionFast max-w-[100px] min-w-[100px] aspect-square flex justify-center items-center flex-col border-dashed border-[1px] text-black border-black rounded-md hover:border-opacity-60 hover:text-opacity-60'
          >
            <PlusOutlined />
            <span>Загрузить</span>
          </button>
        )}
        {addingCitizenFiles.map((item, index) => (
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
                  setAddingCitizenFiles((prev) => [...prev.filter((f, ind) => ind !== index)])
                }
                className='transitionFast text-black hover:text-white'
              >
                <FaTrashCan />
              </button>
            </div>
          </div>
        ))}
        {responseFilesURL.map((item, index) => (
          <div
            key={index}
            className='relative overflow-hidden max-w-[100px] min-w-[100px] aspect-square border-dashed border-[1px] text-sm border-black rounded-md'
          >
            <div className='absolute inset-0 bottom-2 flex justify-center items-center m-auto text-sm text-black text-center'>
              {
                <img
                  alt='маленькое изображение'
                  src={item.name.split('.')[1] === 'pdf' ? pdfPhoto : item.url}
                  className='w-auto h-3/4'
                />
              }
            </div>
            <div className='absolute border-dashed inset-x-0 flex justify-center bottom-0 items-center'>
              <button
                onClick={() => showFile(item.url)}
                className='transitionFast text-black hover:text-white text-lg'
              >
                <IoMdEye />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
