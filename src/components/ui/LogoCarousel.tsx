'use client'

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const logos = [
  { src: '/google.png', alt: 'Google' },
  { src: '/microsoft.png', alt: 'Microsoft' },
  { src: '/android.png', alt: 'Android' },
  { src: '/meta.png', alt: 'Meta' },
  { src: '/youtube.png', alt: 'youtube' },
];

export default function LogoCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      let scrollAmount = 0;
      const scroll = () => {
        scrollAmount += 1;
        if (scrollAmount >= carousel.scrollWidth / 2) {
          scrollAmount = 0;
        }
        carousel.scrollTo({
          left: scrollAmount,
          behavior: 'auto',
        });
      };
      const interval = setInterval(scroll, 20);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto text-center">
        <div
          ref={carouselRef}
          className="relative overflow-hidden w-full max-w-7xl mx-auto"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex w-max">
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="w-48 h-24 flex-shrink-0 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={40}
                  className="object-contain"
                  style={{ filter: 'grayscale(1) opacity(0.6)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
