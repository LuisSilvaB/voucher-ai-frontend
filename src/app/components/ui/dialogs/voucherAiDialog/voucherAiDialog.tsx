import React, { useEffect } from 'react'

import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogPortal } from '@/components/ui/dialog'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import useToggle from '@/app/hooks/useToggle.hook';
import { FormProvider, useForm } from 'react-hook-form';
import { VoucherType } from '@/app/types/voucher.type';
import VoucherAiDialogFile from './voucherAiDialogFile';
import VoucherAiDialogForm from './voucherAiDialogForm/voucherAiDialogForm';
import { createVoucherFeature, getVouchersFeature, updateVoucherFeature } from '@/app/features/voucher.feature';
import { toast } from 'react-toastify';
import { config } from '@/config/api';

type DialogProps = {
  voucher?: VoucherType;
};

const VoucherAiDialog = ({ voucher }: DialogProps) => {
  const loadingCreateVoucher = useSelector((state: RootState) => state.voucher.loadingCreateVoucher)
  const loadingUpdateVoucher = useSelector((state: RootState) => state.voucher.loadingUpdateVoucher)
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
        igv: 0,
        ITEMS: [],
      },
      file: null,
      fileUrl: null,
    },
  })

  const dispatch = useDispatch<AppDispatch>()


  const toggleDialog = useToggle(false)

  const onToggleDialog = async () => {
    toggleDialog.onToggle();
    if(voucher && toggleDialog.isOpen){
      await dispatch(getVouchersFeature());
    }
  }

  const onCreateVoucher = async () => {
    try {
      toast.loading("Creating Voucher...", {
        toastId: "create-voucher",
        position: "bottom-right",
      })
      if (!formMethods.watch("file")) return
      await dispatch(
        createVoucherFeature({
          voucher: {
            ...formMethods.getValues("voucher"),
            date: new Date( formMethods.getValues("voucher.date") ).toISOString(),
          },
          File: formMethods.watch("file")!,
        })
      )
      formMethods.reset()
      toggleDialog.onClose()
      toast.dismiss("create-voucher");
      toast.success("Voucher created successfully!", {
        toastId: "create-voucher-done",
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.dismiss("create-voucher");
    }
  }

  const onUpdateVoucher = async () => {
    try {
      toast.loading("Updating Voucher...", {
        toastId: "update-voucher",
        position: "bottom-right",
      });
      await dispatch(
        updateVoucherFeature({
          voucher: {
            ...formMethods.getValues("voucher"),
            id: voucher?.id ?? '',
            date: new Date( formMethods.getValues("voucher.date") ).toISOString(),
          },
        })
      )
      formMethods.reset()
      toggleDialog.onClose()
      toast.dismiss("update-voucher");
      toast.success("Voucher updated successfully!", {
        toastId: "update-voucher-done",
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.dismiss("update-voucher");
      toast.error("Error updating voucher", {
        toastId: "update-voucher-error",
        position: "bottom-right",
        autoClose: 5000,
      });
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
        fileUrl: voucher?.img_name ? `${config.BUCKET_URL}${voucher?.img_name}` : null,
      });
    } else if (!voucher && !toggleDialog.isOpen) {
      formMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher, toggleDialog.isOpen]);
  return (
    <FormProvider {...formMethods}>
      <Dialog open={toggleDialog.isOpen} onOpenChange={onToggleDialog}>
        <TooltipProvider>
          {voucher ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={toggleDialog.onOpen}
                    size={"icon"}
                    variant="outline"
                    className="items-center justify-center rounded-lg hover:bg-buttonText hover:text-white"
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
                    <Icon
                      remixIconClass="ri-add-line"
                      size="md"
                      color="white"
                    />
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
        <DialogPortal>
          <DialogContent className="min-w-[80vw] min-h-[80vh] flex flex-col ga-1">
            <DialogHeader>
              <DialogTitle>
                {voucher ? "Edit Voucher" : "Add New Voucher"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 font-light text-xs">
                {voucher ? "Edit your voucher" : "Add a new voucher"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 w-full justify-start  flex-1 md:flex-row">
              <VoucherAiDialogForm />
              <VoucherAiDialogFile
                isOpen={toggleDialog.isOpen}
                voucher={voucher}
              />
            </div>

            <DialogFooter className="flex flex-col h-fit">
              <Button variant={"secondary"}>Cancel</Button>
              <Button
                variant={"default"}
                className="bg-button hover:bg-buttonText"
                onClick={voucher ? onUpdateVoucher : onCreateVoucher}
                disabled={voucher ? loadingUpdateVoucher : loadingCreateVoucher}
              >
                {loadingUpdateVoucher || loadingCreateVoucher ? (
                  <Icon
                    remixIconClass="ri-loader-line"
                    size="md"
                    color="white"
                    className="animate-spin"
                  />
                ) : null}
                <span>{voucher ? "Update" : "Create"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </FormProvider>
  );
}

export default React.memo(VoucherAiDialog);