import { cn } from '@/lib/utils'
import React from 'react'
import { concertOne } from '@/fonts'

const Sidebar = () => {
  return (
    <div className="min-w-[170px] flex-1 bg-background border ">
      <div className={cn('h-[45px] flex justify-center items-center', concertOne.className)}>
        <p className=' text-xl text-button'>VOUCHER AI</p>
      </div>
    </div>
  );
}

export default Sidebar