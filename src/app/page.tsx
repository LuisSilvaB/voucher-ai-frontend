'use client'
import React from 'react'
import VoucherAiBody from './components/layout/voucherAiBody'
import VoucherAiHeader from './components/layout/voucherAiHeader'

const Home = () => {
  return (
    <div className='w-full flex flex-col bg-background flex-1 p-4' >
      <VoucherAiHeader />
      <VoucherAiBody />
    </div>
  )
}

export default Home