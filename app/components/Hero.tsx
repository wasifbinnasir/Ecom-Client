import React from 'react'
import Container from './Container'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className='bg-[#F2F0F1] w-full h-auto'>
<Container className="bg-[#F2F0F1] w-full h-auto grid grid-cols-1 md:grid-cols-2 px-6 md:px-14 lg:px-24 gap-y-12 md:gap-x-16 items-center">
      {/* Left Section */}
      <div>
        <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] font-extrabold text-left pt-10 md:pt-24 leading-tight md:leading-[64px]">
          FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
        </h1>
        <p className="text-black/60 text-left text-sm sm:text-base mt-6 sm:mt-8 max-w-md">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 sm:mt-8 text-white bg-black px-8 sm:px-14 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Shop Now
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 sm:gap-x-12 mt-10 sm:mt-12 text-center mx-auto">
          <div>
            <h1 className="text-black text-3xl sm:text-[40px] font-bold">200+</h1>
            <p className="text-black/60 text-sm sm:text-base">
              International Brands
            </p>
          </div>
          <div>
            <h1 className="text-black text-3xl sm:text-[40px] font-bold">2,000+</h1>
            <p className="text-black/60 text-sm sm:text-base whitespace-nowrap">
              High-Quality Products
            </p>
          </div>
          <div className='mx-auto text-center'>
            <h1 className="text-black text-3xl sm:text-[40px] font-bold">30,000+</h1>
            <p className="text-black/60 text-sm sm:text-base">
              Happy Customers
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src="/Hero.jpg"
          alt="Hero Banner"
          fill
          className="object-cover object-top rounded-lg"
          priority
        />
        {/* Decorative Vectors */}
        <Image
          src="/Vector.png"
          alt="Vector Left"
          width={40}
          height={40}
          className="hidden md:absolute top-40 left-2 sm:top-72 sm:left-0 w-10 h-10 sm:w-14 sm:h-14"
        />
        <Image
          src="/Vector.png"
          alt="Vector Right"
          width={72}
          height={72}
          className="hidden md:absolute top-10 right-2 sm:top-28 sm:right-0 w-12 h-12 sm:w-24 sm:h-24"
        />
      </div>
    </Container>
    </div>
    
  )
}
