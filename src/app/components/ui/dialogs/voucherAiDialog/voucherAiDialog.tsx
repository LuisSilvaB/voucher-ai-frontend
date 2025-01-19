import React, { useEffect } from 'react'

import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon'

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import useToggle from '@/app/hooks/useToggle.hook';
import Tesseract from 'tesseract.js';
import { FormProvider, useForm } from 'react-hook-form';
import { VoucherType } from '@/app/types/voucher.type';
import VoucherAiDialogFile from './voucherAiDialogFile';
import VoucherAiDialogForm from './voucherAiDialogForm/voucherAiDialogForm';

type DialogProps = {
  voucher?: VoucherType;
};

const VoucherAiDialog = ({ voucher }: DialogProps) => {

  const formMethods = useForm<{
    voucher:VoucherType
    file: File | null
    fileUrl: string | null
  }>({
    defaultValues: {
      voucher: {
        transaction_number: "",
        date: "",
        total: 0,
        vendor: "",
        tax_amount: 0,
        client: "",
        img_name: "",
        ITEMS: [],
      },
      file: null,
      fileUrl: null,
    },
  })

  const dispatch = useDispatch<AppDispatch>()


  const toggleDialog = useToggle(false)

  const onScanFile = async () => {
    try {
      if (!formMethods.watch("file")) return;
      const { data: { text } } = await Tesseract.recognize(
        formMethods.watch("file")!,
        'spa+eng',
        {
          logger: (m) => console.log(m),
        }
      )
      if (!text || !formMethods.watch("file")) return;

      // dispatch(
      //   scanVoucherFeature({
      //     text,
      //     file: formMethods.watch("file")!,
      //   })
      // );
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    if (voucher && toggleDialog.isOpen) {
      formMethods.reset({
        voucher: {
          ITEMS: voucher?.ITEMS,
          date: voucher?.date,
          img_name: voucher?.img_name,
          client: voucher?.client,
          total: voucher?.total,
          tax_amount: voucher?.tax_amount,
          transaction_number: voucher?.transaction_number,
          vendor: voucher?.vendor,
        },
      });
    } else if (!voucher && !toggleDialog.isOpen) {
      formMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher, toggleDialog.isOpen]);
  return (
    <FormProvider {...formMethods}>
      <Dialog  open={toggleDialog.isOpen} onOpenChange={toggleDialog.onToggle}>
        <TooltipProvider>
          {voucher ? (
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
        <DialogContent className='min-w-[80vw] min-h-[80vh] flex flex-col ga-1'>
          <DialogHeader>
            <DialogTitle>{voucher ? "Edit Voucher" : "Add New Voucher"}</DialogTitle>
            <DialogDescription className="text-gray-600 font-light text-xs">
              {voucher ? "Edit your voucher" : "Add a new voucher"}
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-row gap-2 w-full justify-start  flex-1'>
            <VoucherAiDialogForm />
            <VoucherAiDialogFile isOpen={toggleDialog.isOpen} />
          </div>

          <DialogFooter className='flex flex-col h-fit'>
            <Button variant={"secondary"}>Cancel</Button>
            <Button variant={"default"} className="bg-button hover:bg-buttonText" onClick={onScanFile}>
              Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

export default VoucherAiDialog