import { VoucherType } from '@/app/types/voucher.type'
import TanStackTable from '@/components/ui/tank-stack-table'
import { config } from '@/config/api'
import { RootState } from '@/redux/store'
import { createColumnHelper } from '@tanstack/react-table'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone';
import { DeleteVaucherDialog } from '../dialogs/deleteVaucherDialog'
import { VoucherAiDialog } from '../dialogs/voucherAiDialog'

const VoucherTable = () => {
  const vouchers = useSelector((state:RootState) => state.voucher.vouchers)
  const columnHelper = createColumnHelper<VoucherType>()
  const columns = [
    columnHelper.accessor("img_name", {
      header: "",
      cell: (info) =>
        info.getValue() ? (
          <img
            src={`${config.BUCKET_URL}${info.getValue()}`}
            alt="Voucher"
            className="w-full max-h-[40px] min-w-[30px] rounded-lg"
          />
        ) : null,
    }),
    columnHelper.accessor("transaction_number", {
      header: "Transaction Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total", {
      header: "Total",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("vendor", {
      header: "Vendor",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("igv", {
      header: "Igv",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client", {
      header: "Client",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: (info) => moment(info.getValue()).format("DD/MM/YYYY HH:mm:ss"),
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info) => (
        <div className="flex flex-row gap-2">
          <VoucherAiDialog voucher={info.row.original} />
          <DeleteVaucherDialog voucher={info.row.original} />
        </div>
      ),
    }),
  ];
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