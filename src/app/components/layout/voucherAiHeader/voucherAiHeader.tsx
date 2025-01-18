import { cn } from '@/lib/utils'
import { concertOne } from '@/fonts'
import { VoucherAiDialog } from '../../ui/dialogs/voucherAiDialog'

const VoucherAiHeader = () => {
  return (
    <div className='flex w-full bg-background justify-between'>
      <p className={cn('font-bold text-xl', concertOne.className)}>VOUCHERS</p>
      <VoucherAiDialog />
    </div>
  )
}

export default VoucherAiHeader