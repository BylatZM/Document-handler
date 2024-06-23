import { Form, Input, Modal, Select, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { FC, useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';

interface IProps {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

export const Inputs: FC<IProps> = ({ fileList, setFileList }) => {
  const { error, processedPossessions } = useTypedSelector((state) => state.HelpFormReducer);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const some = async (event: ClipboardEvent) => {
    if (event.clipboardData) {
      var items = event.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (!file) return;
            if (file.size > 1024 * 1024 * 2) {
              alert('Размер загружаемого файла не может превышать 2 Мегабайт');
              return;
            }
            if (!['image/png', 'image/jpg', 'image/jpeg'].some((el) => el === file.type)) {
              alert('Загружаемый файл должен иметь одно из следующих расширений: jpeg, jpg, png');
              return;
            }
            const uploadFile: UploadFile = {
              name: file.name,
              size: file.size,
              originFileObj: file as RcFile,
              uid: Date.now().toString(),
              type: file.type,
              thumbUrl: await getBase64(file as RcFile),
            };
            setFileList((prev) => {
              if (prev.length === 3) {
                alert('Загрузить можно не более 3 фотографий');
                return [...prev];
              }
              return [...prev, uploadFile];
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      some(event);
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    if (!newFileList.length) {
      setFileList([]);
      return;
    }
    if (newFileList.length > 3) {
      alert('Загрузить можно не более 3 фотографий');
      setFileList(fileList);
      return;
    }
    if (newFileList.some((file) => file.size > 1024 * 1024 * 2)) {
      alert('Размер загружаемого файла не может превышать 2 Мегабайт');
      setFileList(fileList);
      return;
    }
    let isBadType = false;
    newFileList.forEach((file) => {
      if (!['image/png', 'image/jpg', 'image/jpeg'].some((el) => el === file.type)) {
        isBadType = true;
      }
    });
    if (isBadType) {
      alert('Загружаемый файл должен иметь одно из следующих расширений: jpeg, jpg, png');
      setFileList(fileList);
      return;
    }
    const validFiles = newFileList.filter((file) => file.size <= 1024 * 1024 * 2);

    setFileList(validFiles);
  };

  return (
    <>
      <Modal
        open={previewOpen}
        className='flex justify-center'
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt='выбранное изображение'
          className='w-auto'
          style={{ height: '25rem' }}
          src={previewImage}
        />
      </Modal>
      <Form.Item
        label='Имя заявителя'
        required
        className='text-base'
        validateStatus={error && error.type === 'name' ? 'error' : undefined}
        help={error && error.type === 'name' && error.error}
        name='name'
      >
        <Input className='rounded-md h-[40px]' placeholder='Булат' maxLength={20} required />
      </Form.Item>
      <Form.Item
        className='text-base'
        label='Контактные данные (номер телефона \ почта)'
        required
        validateStatus={error && error.type === 'contact' ? 'error' : undefined}
        help={error && error.type === 'contact' && error.error}
        name='contact'
      >
        <Input
          className='h-[40px]'
          placeholder='applications@dltex.ru\+79372833608'
          maxLength={40}
          required
        />
      </Form.Item>
      <Form.Item
        name='title'
        className='text-base'
        label='Тема обращения'
        required
        validateStatus={error && error.type === 'title' ? 'error' : undefined}
        help={error && error.type === 'title' && error.error}
      >
        <Input className='h-[40px]' placeholder='Тема обращения' maxLength={20} required />
      </Form.Item>
      <Form.Item
        name='description'
        className='text-base'
        label='Описание проблемы'
        required
        validateStatus={error && error.type === 'description' ? 'error' : undefined}
        help={error && error.type === 'description' && error.error}
      >
        <TextArea
          rows={3}
          maxLength={200}
          placeholder='Описание проблемы'
          style={{ resize: 'none' }}
          required
        />
      </Form.Item>
      <Form.Item className='text-base' label='Прикрепить изображение' name='images'>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onChange={handleUploadChange}
          maxCount={3}
          onPreview={handlePreview}
          multiple={false}
          beforeUpload={() => {
            return false;
          }}
        >
          {fileList.length < 3 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Загрузить</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      {processedPossessions && processedPossessions.length > 0 && (
        <Form.Item name='address' className='text-base' label='Адрес имущества'>
          <Select
            className='h-[40px]'
            options={processedPossessions.map((el) => {
              return { value: el, label: el };
            })}
            placeholder='Адрес имущества'
            maxLength={20}
          />
        </Form.Item>
      )}
      {!processedPossessions && (
        <Form.Item name='address' className='text-base' label='Адрес имущества'>
          <Input className='h-[40px]' placeholder='Адрес имущества' maxLength={100} />
        </Form.Item>
      )}
    </>
  );
};
