import React from 'react'
import { cn } from '@/lib/utils'
import { concertOne } from '@/fonts'
const Navbar = () => {
  return (
    <nav
      className={cn(
        "w-full flex items-center h-[50px] p-2 text-xl bg-background justify-between border"
      )}
    >
        <p className={cn(' text-xl text-button', concertOne.className)}>SMART VOUCHER</p> 

      <div className="flex items-center gap-2">
        <div className="bordder rounded-full bg-button w-8 h-8 text-buttonText">
          <img
            src="https://avatars.githubusercontent.com/u/104279834?s=400&u=a6872b84969cd6b5f606f3dfe664ed2b3769260b&v=4"
            alt="user_img"
            loading="lazy"
            width={100}
            height={100}
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col text-xs mr-3">
          <p className="font-light h-fit">Luis Armando Silva Balladares</p>
          <p className="font-light text-[0.6rem] h-fit text-gray-600">luisarmandoballadares@gmail.com</p>
        </div>
      </div>
    </nav>
  ); 
}

export default Navbar