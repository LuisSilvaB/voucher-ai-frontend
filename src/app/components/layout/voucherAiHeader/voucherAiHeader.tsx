import { cn } from '@/lib/utils'
import { concertOne } from '@/fonts'
import { VoucherAiDialog } from '../../ui/dialogs/voucherAiDialog'
import { AppDispatch } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getVouchersFeature } from '@/app/features/voucher.feature'

const VoucherAiHeader = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(getVouchersFeature())
  }, [dispatch])
  return (
    <div className='flex w-full bg-background justify-between'>
      <p className={cn('font-bold text-xl', concertOne.className)}>VOUCHERS</p>
      <VoucherAiDialog />
    </div>
  )
}

export default VoucherAiHeader