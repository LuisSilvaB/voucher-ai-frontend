import useToggle from "@/app/hooks/useToggle.hook";
import { ItemType, VoucherType } from "@/app/types/voucher.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import React from "react";
import { useFormContext } from "react-hook-form";

const VoucherAiDialogFormProduct = () => {
  const toggleDialog = useToggle(false);
  const { control, setValue, watch } = useFormContext<{
    voucher:VoucherType
    item: ItemType
    file: File | null
    fileUrl: string | null
  }>()

  const onCloseDeleteDialog = () => {
    setValue("item", {
      id: 0,
      code: "",
      name: "",
      quantity: 0,
      unit_price: 0,
    })
    toggleDialog.onClose()
  }

  const onAddProduct = () => {
    setValue("voucher.ITEMS", [...watch("voucher.ITEMS"), {
      ...watch("item"),
      id: Math.floor(Math.random() * 1000000)
    }])
    setValue("item", {
      id: 0,
      code: "",
      name: "",
      quantity: 0,
      unit_price: 0,
    })
    toggleDialog.onClose()
  }
  return (
    <Dialog open={toggleDialog.isOpen} onOpenChange={toggleDialog.onToggle}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>
              <Button size={"icon"} onClick={(e) => {
                e.preventDefault()
                toggleDialog.onOpen()
              }}>
                <Icon remixIconClass="ri-add-line" color="white" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
          >
            <p className="text-sm">Add new product</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add a new product</DialogTitle>
          <DialogDescription>
            Add a new product to your voucher
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row gap-2">
            <FormField
              control={control}
              name="item.code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      placeholder=""
                      className="min-w-56 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="item.name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      placeholder=""
                      className="min-w-56 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex flex-row gap-2">
            <FormField
              control={control}
              name="item.quantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type="number"
                      placeholder=""
                      className="min-w-56 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="item.unit_price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type="number"
                      placeholder=""
                      className="min-w-56 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      <DialogFooter>
        <Button variant={"secondary"} onClick={onCloseDeleteDialog}>
          Cancel
        </Button>
        <Button variant={"default"} className="bg-button hover:bg-buttonText" onClick={onAddProduct}>
          Add Product
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherAiDialogFormProduct;
