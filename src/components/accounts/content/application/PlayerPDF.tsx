import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Pagination } from 'antd';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';

export const PlayerPDF: FC<{ propsFile: File | null | string }> = ({ propsFile }) => {
  const [targetFile, setTargetFile] = useState<File | string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotal(numPages);
  };

  useEffect(() => {
    if (!propsFile) {
      setTargetFile(null);
    }
    setTargetFile(propsFile);
  }, [propsFile]);
  return (
    <div
      className={clsx(
        'overflow-hidden flex flex-col gap-y-2 relative h-auto max-h-[30rem] max-sm:max-h-3/4 max-sm:max-h-3/4 max-w-[30rem] max-sm:max-w-3/4',
        targetFile ? 'block' : 'hidden',
      )}
    >
      <Document
        className='overflow-auto'
        onLoadSuccess={onDocumentLoadSuccess}
        file={!targetFile ? '' : targetFile}
        loading={
          <div className='w-full h-full flex flex-col gap-y-2 justify-center items-center text-blue-700'>
            <AiOutlineLoading className='animate-spin text-4xl' />
            <span className='text-lg'>Загрузка</span>
          </div>
        }
        error={
          <div className='w-full h-full flex flex-col gap-y-2 justify-center items-center text-red-700'>
            <BiError className='text-4xl' />
            <span className='text-lg'>Ошибка при загрузке документа</span>
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          loading={
            <div className='w-full h-full flex flex-col gap-y-2 justify-center items-center text-lg'>
              <AiOutlineLoading className='animate-spin text-blue-700' />
              <span>Загрузка</span>
            </div>
          }
        />
      </Document>
      {total && total > 1 && (
        <Pagination
          onChange={(e) => setPageNumber(e)}
          showSizeChanger={false}
          defaultCurrent={pageNumber}
          total={total * 10}
        />
      )}
    </div>
  );
};
