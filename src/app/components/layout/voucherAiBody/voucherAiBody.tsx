import TanStackTable from "@/components/ui/tank-stack-table"

const VoucherAiBody = () => {
  return (
    <div className="w-full h-full flex flex-1 bg-background">
      <TanStackTable data={[]} columns={[]} remixIconClass="ri-file-list-line" emptyMessage="No hay datos registrados" />
    </div>
  )
}

export default VoucherAiBody