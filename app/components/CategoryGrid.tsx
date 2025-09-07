import React, { useState } from 'react';
import Link from 'next/link';

interface DressStyleItem {
  id: string;
  title: string;
  image: string;
}

const DressStyleBrowser: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dressStyles: DressStyleItem[] = [
    {
      id: 'casual',
      title: 'Casual',
      image: '/casual.png',
    },
    {
      id: 'formal',
      title: 'Formal',
      image: '/formal.png',
    },
    {
      id: 'party',
      title: 'Party',
      image: '/party.png',
    },
    {
      id: 'gym',
      title: 'Gym',
      image: '/gym.png',
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-full p-4 mt-4">
      <div
        className="bg-gray-100 rounded-[40px] p-12 shadow-lg min-h-[866px]"
        style={{
          width: '1240px',
          backgroundColor: '#F0F0F0',
        }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-black tracking-wider">
            BROWSE BY DRESS STYLE
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 h-full sm:h-[600px] text-black">
          {/* Casual */}
          <Link
            href="/products"
            className={`col-span-1 sm:col-span-1 relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 ${
              hoveredItem && hoveredItem !== 'casual' ? 'blur-sm' : 'blur-none'
            }`}
            onMouseEnter={() => setHoveredItem('casual')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={dressStyles[0].image}
              alt="Casual Style"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent">
              <div className="absolute top-8 left-8">
                <h2 className="text-4xl font-bold text-black drop-shadow-lg">
                  {dressStyles[0].title}
                </h2>
              </div>
            </div>
          </Link>

          {/* Formal */}
          <Link
            href="/products"
            className={`col-span-1 sm:col-span-2 relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 ${
              hoveredItem && hoveredItem !== 'formal' ? 'blur-sm' : 'blur-none'
            }`}
            onMouseEnter={() => setHoveredItem('formal')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={dressStyles[1].image}
              alt="Formal Style"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent">
              <div className="absolute top-8 left-8">
                <h2 className="text-4xl font-bold text-black drop-shadow-lg">
                  {dressStyles[1].title}
                </h2>
              </div>
            </div>
          </Link>

          {/* Party */}
          <Link
            href="/products"
            className={`col-span-1 sm:col-span-2 relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 ${
              hoveredItem && hoveredItem !== 'party' ? 'blur-sm' : 'blur-none'
            }`}
            onMouseEnter={() => setHoveredItem('party')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={dressStyles[2].image}
              alt="Party Style"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent">
              <div className="absolute top-8 left-8">
                <h2 className="text-4xl font-bold text-black drop-shadow-lg">
                  {dressStyles[2].title}
                </h2>
              </div>
            </div>
          </Link>

          {/* Gym */}
          <Link
            href="/products"
            className={`col-span-1 relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 ${
              hoveredItem && hoveredItem !== 'gym' ? 'blur-sm' : 'blur-none'
            }`}
            onMouseEnter={() => setHoveredItem('gym')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={dressStyles[3].image}
              alt="Gym Style"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent">
              <div className="absolute top-8 left-8">
                <h2 className="text-4xl font-bold text-black drop-shadow-lg">
                  {dressStyles[3].title}
                </h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DressStyleBrowser;
