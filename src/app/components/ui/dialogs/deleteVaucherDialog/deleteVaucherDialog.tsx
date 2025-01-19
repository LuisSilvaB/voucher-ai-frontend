import React from 'react'
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

import useToggle from '@/app/hooks/useToggle.hook'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { VoucherType } from '@/app/types/voucher.type';
import { config } from '@/config/api';
import { deleteVoucherFeature } from '@/app/features/voucher.feature';

type DialogProps = {
  voucher: VoucherType;
};

const DeleteVaucherDialog = ({ voucher }: DialogProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const toggleDeleteDialog = useToggle(false)

  const onDeleteVoucher = async () => {
    try {
      if (!voucher) return;
      await dispatch(
        deleteVoucherFeature({
          id: voucher.id,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  const onCloseDeleteDialog = () => {
    toggleDeleteDialog.onClose()
  }

  return (
    <Dialog
      open={toggleDeleteDialog.isOpen}
      onOpenChange={toggleDeleteDialog.onToggle}
    >
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>
              <Button
                onClick={toggleDeleteDialog.onOpen}
                size={"icon"}
                variant={"destructive"}
                className="items-center justify-center rounded-lg  hover:bg-buttonText"
              >
                <Icon
                  remixIconClass="ri-delete-bin-line"
                  size="md"
                  color="white"
                />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
          >
            <p className="text-sm">Delete Voucher</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Voucher</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full justify-start items-start flex flex-col gap-2">
          <p className="text-gray text-sm">
            Are you sure you want to delete this voucher?
          </p>
          <div className="flex flex-row justify-between gap-2 w-full">
            <div className="flex flex-col gap-2 text-gray-600 font-light text-xs">
              <p>
                <span>Transaction Number: </span>
                {voucher?.transaction_number ?? ""}
              </p>
              <p>
                <span>Date: </span>
                {voucher?.date ?? ""}
              </p>
              <p>
                <span>Total: </span>
                {voucher?.total ?? ""}
              </p>
              <p>
                <span>Vendor: </span>
                {voucher?.vendor ?? ""}
              </p>
              <p>
                <span>Tax Amount: </span>
                {voucher?.tax_amount ?? ""}
              </p>
              <p>
                <span>Client: </span>
                {voucher?.client ?? ""}
              </p>
            </div>
            <div>
              <img
                src={`${config.BUCKET_URL}${voucher?.img_name}`}
                alt="Voucher"
                className="w-full max-h-[150px] min-w-[30px] rounded-lg"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            className="font-medium py-2 px-4 rounded-lg hover:bg-gray-200"
            onClick={onCloseDeleteDialog}
          >
            Cancel
          </Button>
          <Button
            className="bg-button hover:bg-buttonText text-white font-medium py-2 px-4 rounded-lg"
            onClick={onDeleteVoucher}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteVaucherDialog