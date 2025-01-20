import { scanVoucherTesseractFeature,  scanVoucherWithGoogleVisionFeature } from '@/app/features/voucher.feature';
import { ItemType, VoucherType } from '@/app/types/voucher.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppDispatch } from '@/redux/store';
import React, { DragEvent, ChangeEvent, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Icon from '@/components/ui/icon';
import Tesseract from 'tesseract.js';
import VoucherAiPopoverFileTesseract from '../../../popover/voucherAiPopoverFileTesseract';
import VoucherAiPopoverFileGoogleVision from '../../../popover/voucherAiPopoverFileGoogleVision';

type VoucherAiDialogFileProps = {
  isOpen: boolean;
}

const VoucherAiDialogFile = ({ isOpen }: VoucherAiDialogFileProps) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [ loadingScanVoucher, setLoadingScanVoucher ] = useState<boolean>(false);
  const [ ocr, setOcr ] = useState<"google-vision" | "tesseract">("google-vision");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>()

  const {watch, setValue} = useFormContext<{
    voucher:VoucherType
    file: File | null
    fileUrl: string | null
  }>()


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setIsDragging(false);
      setValue("file", selectedFile);
      setValue("fileUrl", URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setIsDragging(false);
      setValue("file", droppedFile);
      setValue("fileUrl", URL.createObjectURL(droppedFile));
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

  const onRemoveFile = () => {
    setValue("file", null);
    setValue("fileUrl", null);
  }


  const onScanVoucher = async (ocr: "google-vision" | "tesseract" ,model: "groq" | "together" | "gemini") => {
    try{
      let response;
      setLoadingScanVoucher(true);
      toast.loading(`Scanning Voucher...`, {
        toastId: "scan-voucher",
        position: "bottom-right",
      })
      if (!watch("file")) return;
      if(ocr === "google-vision"){
        setOcr("google-vision");
        response = await dispatch(scanVoucherWithGoogleVisionFeature({ file: watch("file")!, model }));
      } else if (ocr === "tesseract") {
        setOcr("tesseract");
        const { data: { text } } = await Tesseract.recognize(
          watch("file")!,
          'spa+eng',
          {
            // logger: (m) => console.log(m),
          }
        );
        response = await dispatch(scanVoucherTesseractFeature({ text: text, model }));
      } else {
        console.warn("Invalid ocr provided.");
        toast.dismiss("scan-voucher");
        setLoadingScanVoucher(false);
        return;
      }

      if (response.payload) {
        setValue("voucher.igv", response.payload.igv ?? "");
        setValue("voucher.transaction_number", response.payload.transaction_number);
        setValue("voucher.date", response.payload.date);
        setValue("voucher.vendor", response.payload.vendor);
        setValue("voucher.tax_amount", response.payload.tax_amount);
        setValue("voucher.client", response.payload.client);
        setValue("voucher.id", uuidv4());
        setValue(
          "voucher.ITEMS",
          Array.isArray(response.payload.ITEMS)
            ? response.payload.ITEMS.map((item: ItemType) => ({
                ...item,
                id: Math.floor(Math.random() * 1000000),
              }))
            : []
        );
        toast.dismiss("scan-voucher");
        toast.success("Voucher scanned successfully!", {
          toastId: "scan-tesseract-done",
          position: "bottom-right",
        });
      }
      setLoadingScanVoucher(false);
    } catch(e){console.log(e)} finally {
      setLoadingScanVoucher(false);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
    }
  }, [isOpen])

  return (
    <div className="flex w-full flex-1  justify-start items-center flex-col gap-2">
      <p>Upload your voucher and scan with AI</p>
      {watch("fileUrl") ? (
        <div className="relative flex justify-end w-full flex-1 overflow-y-auto rounded-lg">
          <div className="sticky w-full flex justify-end top-0 right-0  gap-2 p-2 z-20">
            <VoucherAiPopoverFileGoogleVision
              ocr={ocr}
              loadingGoogleVision={loadingScanVoucher}
              onScanByGoogleVision={onScanVoucher}
            />
            <VoucherAiPopoverFileTesseract
              ocr={ocr}
              loadingTesseract={loadingScanVoucher}
              onScanByTesseract={onScanVoucher}
            />
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={onRemoveFile}
            >
              <Icon
                remixIconClass="ri-delete-bin-line"
                size="md"
                color="white"
              />
            </Button>
          </div>
          <div className="absolute top-0 min-h-[430px] rounded-lg">
            <img
              src={watch("fileUrl") ?? ""}
              alt="Voucher"
              className="w-full min-h-[300px] rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col justify-center flex-1 h-full items-center w-full border-dotted border-2 border-gray-200 rounded-lg p-4 text-gray-500 font-light text-xs gap-2 cursor-pointer transition-all ease-out duration-300",
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
          {watch("file") && (
            <p className="text-sm text-gray-600 mt-2">
              File selected: <strong>{watch("file")?.name ?? ""}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VoucherAiDialogFile