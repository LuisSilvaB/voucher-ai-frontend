import { deleteVoucherImgFeature, scanVoucherGroqVisionFeature, scanVoucherTesseractFeature, scanVoucherWithGoogleVisionFeature, updateVoucherImgFeature } from '@/app/features/voucher.feature';
import { ItemType, VoucherType } from '@/app/types/voucher.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppDispatch } from '@/redux/store';
import React, { DragEvent, ChangeEvent, useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import Icon from '@/components/ui/icon';
import Tesseract from 'tesseract.js';
import VoucherAiPopoverFileTesseract from '../../../popover/voucherAiPopoverFileTesseract';
import VoucherAiPopoverFileGoogleVision from '../../../popover/voucherAiPopoverFileGoogleVision';

type VoucherAiDialogFileProps = {
  isOpen: boolean;
  voucher?: VoucherType;
};

const VoucherAiDialogFile = ({ isOpen, voucher }: VoucherAiDialogFileProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loadingScanVoucher, setLoadingScanVoucher] = useState<boolean>(false);
  const [ocr, setOcr] = useState<"google-vision" | "tesseract" | "groq-vision">("google-vision");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { watch, setValue } = useFormContext<{
    voucher: VoucherType;
    file: File | null;
    fileUrl: string | null;
  }>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    if (selectedFile && !voucher) {
      setIsDragging(false);
      setValue("file", selectedFile);
      setValue("fileUrl", URL.createObjectURL(selectedFile));
    } else if ( selectedFile && voucher) {
      toast.loading("Updating Voucher...", {
        toastId: "update-voucher",
        position: "bottom-right",
      });
      setIsDragging(false);
      setValue("fileUrl", URL.createObjectURL(selectedFile));
      setValue("file", selectedFile);
      dispatch(updateVoucherImgFeature({ voucher_id: voucher.id ?? '', file: selectedFile }));
      toast.dismiss("update-voucher");
      toast.success("Voucher updated successfully!", {
        toastId: "update-voucher-done",
        position: "bottom-right",
      });
    }else{
      setIsDragging(false);
    }
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && !voucher) {
      setIsDragging(false);
      setValue("file", droppedFile);
      setValue("fileUrl", URL.createObjectURL(droppedFile));
    } else if (droppedFile && voucher) {
      toast.loading("Updating Voucher...", {
        toastId: "update-voucher",
        position: "bottom-right",
      });
      setIsDragging(false);
      setValue("fileUrl", URL.createObjectURL(droppedFile));
      setValue("file", droppedFile);
      dispatch(updateVoucherImgFeature({ voucher_id: voucher.id ?? '', file: droppedFile }));
      toast.dismiss("update-voucher");
      toast.success("Voucher updated successfully!", {
        toastId: "update-voucher-done",
        position: "bottom-right",
      });
    } else {
      setIsDragging(false);
    }
  }, [dispatch, setValue, voucher]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }, [fileInputRef]);

  const onRemoveFile = useCallback(() => {
    setValue("file", null);
    setValue("fileUrl", null);
  }, [setValue]);

  const onDeleteVoucherImg = useCallback(async () => {
    try {
      toast.loading("Deleting Voucher...", {
        toastId: "delete-voucher",
        position: "bottom-right",
      });
      if (!voucher) return;
      await dispatch(
        deleteVoucherImgFeature({
          voucher_id: voucher.id ?? '',
          img_name: voucher.img_name ?? '',
        })
      );
      setValue("file", null);
      setValue("fileUrl", null);
      toast.dismiss("delete-voucher");
      toast.success("Voucher deleted successfully!", {
        toastId: "delete-voucher-done",
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.dismiss("delete-voucher");
    }
  }, [dispatch, voucher]);

  const onScanVoucher = useCallback(async (ocr: "google-vision" | "tesseract" | "groq-vision", model: "groq" | "together" | "gemini") => {
    try {
      let response;
      setLoadingScanVoucher(true);
      toast.loading(`Scanning Voucher...`, {
        toastId: "scan-voucher",
        position: "bottom-right",
      });
      if (!watch("file")) return;
      if (ocr === "google-vision") {
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
      } else if (ocr === "groq-vision") {
        setOcr("groq-vision");
        response = await dispatch(scanVoucherGroqVisionFeature({ file: watch("file")!, model }));
      } else {
        console.warn("Invalid ocr provided.");
        toast.dismiss("scan-voucher");
        setLoadingScanVoucher(false);
        return;
      }

      if (response.payload) {
        setValue("voucher.igv", response.payload.igv ?? "");
        setValue("voucher.transaction_number", response.payload.transaction_number);
        setValue(
          "voucher.date",
          moment(response.payload.date, ["YYYY-MM-DD", "DD/MM/YYYY"], true).isValid()
            ? moment(response.payload.date, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD")
            : ''
        );
        setValue("voucher.total", response.payload.total);
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
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingScanVoucher(false);
    }
  }, [dispatch, setValue, watch]);

  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
    }
  }, [isOpen]);

  return (
    <div className="flex w-full flex-1 justify-start items-center flex-col gap-2">
      <p>Upload your voucher and scan with AI</p>
      {watch("fileUrl") ? (
        <div className="relative flex justify-end w-full flex-1 overflow-y-auto rounded-lg">
          <div className="sticky w- flex justify-end top-0 right-0 gap-2 p-2 z-20">
            {!watch("file") ? null :<div className='flex flex-row gap-2 h-fit items-center'>

            <Button
              variant="secondary"
              size="default"
              className="bg-background hover:bg-buttonText text-black hover:text-white font-medium py-2 px-4 rounded-lg"
              onClick={() => onScanVoucher("groq-vision", "groq")}
            >
              {loadingScanVoucher && ocr === "groq-vision" ? (
                <Icon
                  remixIconClass="ri-loader-line"
                  size="md"
                  color="white"
                  className="animate-spin"
                />
              ) : (
                <Icon
                  remixIconClass="ri-qr-scan-line"
                  size="md"
                  color="white"
                />
              )}
              <span>Groq Vision</span>
            </Button>
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
            </div> }
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={voucher ? onDeleteVoucherImg : onRemoveFile}
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
          {watch("file") ? (
            <p className="text-sm text-gray-600 mt-2">
              File selected: <strong>{watch("file")?.name ?? ""}</strong>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default React.memo(VoucherAiDialogFile);
