import { VoucherType } from '@/app/types/voucher.type'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import VoucherAiDialogFormProduct from '../voucherAiDialogFormProduct'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

const VoucherAiDialogForm = () => {
  const { control, watch, setValue } = useFormContext<{
    voucher:VoucherType
    file: File | null
    fileUrl: string | null
  }>()
  return (
    <form className="flex flex-col flex-1 gap-2">
      <div className="w-full flex flex-row gap-2">
        <FormField
          control={control}
          name="voucher.client"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Client Name</FormLabel>
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
          name="voucher.date"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="date"
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
          name="voucher.total"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total</FormLabel>
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
        {/* <FormField
          control={control}
          name="voucher.tax_amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tax Amount</FormLabel>
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
        /> */}
        <FormField
          control={control}
          name="voucher.igv"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>IGV</FormLabel>
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
      <div className="w-full flex flex-row gap-2">
        <FormField
          control={control}
          name="voucher.transaction_number"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Transaction Number</FormLabel>
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
          name="voucher.vendor"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Vendor</FormLabel>
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
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-between items-center">
          <Label className="mt-3">Products</Label>
          <VoucherAiDialogFormProduct />
        </div>
        <div className="w-full h-full rounded-lg flex flex-col gap-2 mt-2 overflow-y-auto max-h-[325px]">
          {watch("voucher.ITEMS").length ? (
            watch("voucher.ITEMS").map((item, index) => (
              <div key={index} className="w-full flex flex-row gap-2">
                <div className="w-full flex flex-col gap-1 border rounded-xl p-3 text-gray-500 text-xs font-normal">
                  <p className="text-gray text-sm flex w-full justify-between">
                    <span>Code: </span>
                    {item?.code ?? ""}
                  </p>
                  <p className="text-gray text-sm flex w-full justify-between">
                    <span>Name: </span>
                    {item?.name ?? ""}
                  </p>
                  <p className="text-gray text-sm flex w-full justify-between">
                    <span>Quantity: </span>
                    {item?.quantity ?? ""}
                  </p>
                  <p className="text-gray text-sm flex w-full justify-between">
                    <span>Unit Price: </span>
                    {item?.unit_price ?? ""}
                  </p>
                </div>
                <div className="flex w-fit justify-end">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="bg-button hover:bg-buttonText text-white font-medium py-2 px-4 rounded-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setValue(
                        "voucher.ITEMS",
                        watch("voucher.ITEMS").filter(
                          (product) => product.id !== item.id
                        )
                      );
                    }}
                  >
                    <Icon
                      remixIconClass="ri-delete-bin-line"
                      size="md"
                      color="white"
                    />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full border flex flex-col gap-2 justify-center items-center">
              <Icon remixIconClass="ri-box-line" size="3xl" color="gray" />
              <p className="text-gray text-sm">No products added</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default VoucherAiDialogForm