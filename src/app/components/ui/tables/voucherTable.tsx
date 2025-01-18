import { VoucherType } from '@/app/types/voucher.type'
import TanStackTable from '@/components/ui/tank-stack-table'
import { RootState } from '@/redux/store'
import { createColumnHelper } from '@tanstack/react-table'
import { useSelector } from 'react-redux'

const VoucherTable = () => {
  const vouchers = useSelector((state:RootState) => state.voucher.vouchers)
  const columnHelper = createColumnHelper<VoucherType>()
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created At',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('vendor', {
      header: 'Vendor',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tax_amount', {
      header: 'Tax Amount',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('client', {
      header: 'Client',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('img_url', {
      header: 'Image',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex flex-row gap-2">
          <button className="bg-button hover:bg-buttonText text-white font-medium py-2 px-4 rounded-lg" onClick={() => console.log('Edit', info.getValue())}>
            Edit
          </button>
          <button className="bg-button hover:bg-buttonText text-white font-medium py-2 px-4 rounded-lg" onClick={() => console.log('Delete', info.getValue())}>
            Delete
          </button>
        </div>
      ),
    }),
  ]
  return (
    <TanStackTable
      data={vouchers}
      columns={columns}
      remixIconClass="ri-file-list-line"
      emptyMessage="No hay datos registrados"
    />
  );
}

export default VoucherTable