import React, { useState, ChangeEvent, DragEvent, useEffect, useRef } from 'react'

import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon'

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import { scanVoucherFeature } from '@/app/features/voucher.feature';

import useToggle from '@/app/hooks/useToggle.hook';
import { cn } from '@/lib/utils';
import Tesseract from 'tesseract.js';

type DialogProps = {
  id?: string;
};

const VoucherAiDialog = ({ id }: DialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileUrl(URL.createObjectURL(droppedFile));
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click(); 
  }

  const toggleDialog = useToggle(false)

  const onScanFile = async () => {
    try {
      if (!file) return;
      const { data: { text } } = await Tesseract.recognize(
        file,
        'spa+eng',
        {
          logger: (m) => console.log(m),
        }
      )
      if (!text || !file) return;

      console.log(text, file)
      dispatch(
        scanVoucherFeature({
          text,
          file,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    if (!toggleDialog.isOpen) {
      setIsDragging(false);
      setFile(null);
      setFileUrl(null);
    }
  }, [toggleDialog])
  return (
    <Dialog open={toggleDialog.isOpen} onOpenChange={toggleDialog.onToggle}>
      <TooltipProvider>
        {id ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={toggleDialog.onOpen}
                  size={"sm"}
                  variant="secondary"
                  className="items-center justify-center rounded-lg bg-button hover:bg-buttonText"
                >
                  <Icon
                    remixIconClass="ri-pencil-line"
                    size="md"
                    color="gray"
                  />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Edit Voucher</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={toggleDialog.onOpen}
                  size={"sm"}
                  className="items-center justify-center rounded-lg bg-button hover:bg-buttonText"
                >
                  <Icon remixIconClass="ri-add-line" size="md" color="white" />
                  <p className="ml-1">New Voucher</p>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Add New Voucher</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? "Edit Voucher" : "Add New Voucher"}</DialogTitle>
          <DialogDescription className="text-gray-600 font-light text-xs">
            {id ? "Edit your voucher" : "Add a new voucher"}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full justify-center items-center flex flex-col gap-2">
          <p>Upload your voucher</p>
          {fileUrl ? (
            <div className='w-full max-h-[500px] overflow-y-auto'>
              <img
                src={fileUrl}
                alt="Voucher"
                className="w-full min-h-[500px]"
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col justify-center items-center w-full border-dotted border-2 border-gray-200 rounded-lg p-4 h-48 text-gray-500 font-light text-xs gap-2 cursor-pointer transition-all ease-out duration-300",
                isDragging ? "border-green-400" : ""
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <Icon remixIconClass="ri-upload-2-line" size="3xl" color="gray" />
              <p>Drag and drop your voucher here</p>
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  File selected: <strong>{file.name}</strong>
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant={"secondary"}>Cancel</Button>
          <Button variant={"default"} className="bg-button hover:bg-buttonText" onClick={onScanFile}>
            Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default VoucherAiDialog