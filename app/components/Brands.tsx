import React from 'react'
import Container from './Container'
import Image from 'next/image'

const brands = [
  { name: 'Versace', src: '/ver.svg' },
  { name: 'Zara', src: '/zara.svg' },
  { name: 'Gucci', src: '/gucci.svg' },
  { name: 'Prada', src: '/prada.svg' },
  { name: 'Calvin', src: '/calvin.svg' },
]

export default function Brands() {
  return (
    <div className="bg-black py-8">
      <Container className="flex flex-wrap items-center justify-center gap-8 gap-x-24">
        {brands.map((brand, i) => (
          <div key={i} className="flex items-center justify-center">
            <Image 
              src={brand.src} 
              alt={brand.name} 
              width={120} 
              height={60} 
              className="object-contain"
            />
          </div>
        ))}
      </Container>
    </div>
  )
}
