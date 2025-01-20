import { scanVoucherTesseractGroqFeature, scanVoucherTesseractTogetherFeature, scanVoucherWithGoogleVisionFeature } from '@/app/features/voucher.feature';
import { ItemType, VoucherType } from '@/app/types/voucher.type';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { AppDispatch } from '@/redux/store';
import React, { DragEvent, ChangeEvent, useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Tesseract from 'tesseract.js';
import { v4 as uuidv4 } from 'uuid';
import VoucherAiPopoverFileTesseract from '../../../popover/voucherAiPopoverFileTesseract';
import { toast } from 'react-toastify';

type VoucherAiDialogFileProps = {
  isOpen: boolean;
}

const VoucherAiDialogFile = ({ isOpen }: VoucherAiDialogFileProps) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>()
  const [ loadingScanTesseract, setLoadingScanTesseract ] = React.useState<boolean>(false);
  const [ loadingScanGoogleVision, setLoadingScanGoogleVision ] = React.useState<boolean>(false);

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

  const onScanByGoogleVision = async () => {
    try {
      setLoadingScanGoogleVision(true);
      toast.loading(`Scanning Voucher by Google Vision...`, {
        toastId: "scan-google-vision",
        position: "bottom-right",
      })

      if (!watch("file")) return;

      const response = await dispatch(scanVoucherWithGoogleVisionFeature({
        file: watch("file")!,
      }))

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
        toast.dismiss("scan-google-vision");
        toast.success("Voucher scanned successfully!", {
          toastId: "scan-google-vision-done",
          position: "bottom-right",
        });
      }

    } catch (error) {
      console.error(error);
    }
  }

  const onScanByTesseract = async (variant: string) => {
    try {
      setLoadingScanTesseract(true);
      toast.loading(`Scanning Voucher by teseract and ${variant}...`, {
        toastId: "scan-tesseract",
        position: "bottom-right",
      })

      if (!watch("file")) return;
  
      const { data: { text } } = await Tesseract.recognize(
        watch("file")!,
        'spa+eng',
        {
          logger: (m) => console.log(m),
        }
      );
  
      if (!text) return;
  
      let response;
  
      if (variant === "groq") {
        response = await dispatch(
          scanVoucherTesseractGroqFeature({
            text,
          })
        );
      } else if (variant === "together") {
        response = await dispatch(
          scanVoucherTesseractTogetherFeature({
            text,
          })
        );
      } else {
        console.warn("Invalid variant provided.");
        toast.dismiss("scan-tesseract");
        setLoadingScanTesseract(false);
        return;
      }
  
      const voucher = response.payload;
  
      if (voucher) {
        setValue("voucher.igv", voucher.igv ?? "");
        setValue("voucher.transaction_number", voucher.transaction_number);
        setValue("voucher.date", voucher.date);
        setValue("voucher.vendor", voucher.vendor);
        setValue("voucher.tax_amount", voucher.tax_amount);
        setValue("voucher.client", voucher.client);
        setValue("voucher.id", uuidv4());
        setValue(
          "voucher.ITEMS",
          Array.isArray(voucher.ITEMS)
            ? voucher.ITEMS.map((item: ItemType) => ({
                ...item,
                id: Math.floor(Math.random() * 1000000),
              }))
            : []
        );
        toast.dismiss("scan-tesseract");
        toast.success("Voucher scanned successfully!", {
          toastId: "scan-tesseract-done",
          position: "bottom-right",
        });
      }
  
      setLoadingScanTesseract(false);
    } catch (error) {
      console.error(error);
      setLoadingScanTesseract(false);
    }
  };
  
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
            <Button
              variant={"secondary"}
              size={"default"}
              className="bg-background hover:bg-buttonText text-black hover:text-white font-medium py-2 px-4 rounded-lg"
              onClick={onScanByGoogleVision}
            >
              <Icon remixIconClass="ri-qr-scan-line" size="md" color="white" />
              <span>Google Vision</span>
            </Button>
            <VoucherAiPopoverFileTesseract loadingTesseract={loadingScanTesseract} onScanByTesseract={onScanByTesseract} />
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