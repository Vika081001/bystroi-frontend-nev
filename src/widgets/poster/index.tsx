"use client"
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/kit/button";

const Poster = () => {
  const slides = [
    {
      id: 1,
      image: "https://b.fotohosting.pro/2025/12/12/DOM-BEZ-KNOPKI.png",
      buttonText: "Смотреть предложения",
      buttonLink: "/products"
    },
    {
      id: 2,
      image: "https://a.fotohosting.pro/2025/12/12/EDA-BEZ-KNOPKI.png",
      buttonText: "Заказать еду",
      buttonLink: "/products"
    },
    {
      id: 3,
      image: "https://b.fotohosting.pro/2025/12/12/TVETY-2-BEZ-KNOPKI.png",
      buttonText: "Заказать цветы",
      buttonLink: "/products"
    },
    {
      id: 4,
      image: "https://a.fotohosting.pro/2025/12/12/TVETY-1-BEZ-KNOPKI.png",
      buttonText: "Заказать цветы",
      buttonLink: "/products"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ];

  const getPrevIndex = (current: number) => {
    return current === 0 ? slides.length - 1 : current - 1;
  };

  const getNextIndex = (current: number) => {
    return current === slides.length - 1 ? 0 : current + 1;
  };

  const handlePrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      if (prev <= 0) return slides.length - 1;
      return prev - 1;
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      if (prev >= slides.length - 1) return 0;
      return prev + 1;
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section className="py-4 w-full">
      <div className="h-56 w-full">
        <div className="relative h-full rounded-lg overflow-hidden">
          <div className="absolute inset-0 rounded-lg">
            <div className="relative w-full h-full rounded-lg">
              <div className="absolute left-0 top-0 w-1/10 h-full overflow-hidden z-0 rounded-lg">
                <div className={`absolute inset-0 left-0 rounded-lg transition-all duration-500`}>
                  <Image
                    src={slides[getPrevIndex(currentIndex)].image}
                    fill
                    className="object-cover object-left"
                    alt="Previous slide"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 rounded-lg" />
                </div>
              </div>
              <div className="absolute right-0 top-0 rounded-lg w-1/10 h-full z-0">
                <div className={`absolute inset-0 rounded-lg transition-all duration-500`}>
                  <Image
                    src={slides[getNextIndex(currentIndex)].image}
                    fill
                    className="object-cover object-left rounded-lg"
                    alt="Next slide"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 rounded-lg" />
                </div>
              </div>

              <div className="absolute left-50 rounded-lg top-0 w-365 h-full z-10">
                <div className={`absolute inset-0 rounded-lg transition-opacity duration-500`}>
                  <Image
                    src={slides[currentIndex].image}
                    fill
                    className="object-fill rounded-lg"
                    alt="Current slide"
                    priority
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-20 h-full top-8 right-140 flex flex-col justify-end md:p-10 lg:p-16 ">
            <div className="max-w-2xl mx-auto">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-semibold py-6 text-base md:text-lg transition-all duration-300"
                onClick={() => window.location.href = slides[currentIndex].buttonLink}
              >
                {slides[currentIndex].buttonText}
              </Button>
            </div>
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-0 w-50 h-60 z-30 p-3 bg-black/0 "
            aria-label="Previous slide"
          >
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-0 w-50 h-60 z-30 p-3 bg-black/0 "
            aria-label="Next slide"
          >
          </button>
        </div>
      </div>
    </section>
  );
};

export default Poster;