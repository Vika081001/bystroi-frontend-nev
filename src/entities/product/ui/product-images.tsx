"use client"
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { Product } from "../model";
import { transformImageUrl } from "@/shared/lib/image-utils";

import { Button } from "@/shared/ui/kit/button";

type Props = Pick<Product, "images">;

export const ProductImages = ({ images }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  const transformedImages = images?.map(img => transformImageUrl(img)) || [];
  const hasMultipleImages = transformedImages.length > 1;
  
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const changeImageWithAnimation = useCallback((newIndex: number, dir: 'left' | 'right') => {
    if (isTransitioning || transformedImages.length === 0) return;
    
    setIsTransitioning(true);
    setDirection(dir);
    
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
        setDirection(null);
      }, 150);
    }, 300);
  }, [isTransitioning, transformedImages.length]);

  const nextImage = useCallback(() => {
    if (!hasMultipleImages) return;
    
    const newIndex = currentImageIndex === transformedImages.length - 1 ? 0 : currentImageIndex + 1;
    changeImageWithAnimation(newIndex, 'left');
  }, [currentImageIndex, transformedImages.length, hasMultipleImages, changeImageWithAnimation]);

  const prevImage = useCallback(() => {
    if (!hasMultipleImages) return;
    
    const newIndex = currentImageIndex === 0 ? transformedImages.length - 1 : currentImageIndex - 1;
    changeImageWithAnimation(newIndex, 'right');
  }, [currentImageIndex, transformedImages.length, hasMultipleImages, changeImageWithAnimation]);

  const handleThumbnailClick = (index: number) => {
    if (index === currentImageIndex) return;
    
    const dir = index > currentImageIndex ? 'left' : 'right';
    changeImageWithAnimation(index, dir);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !hasMultipleImages) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      nextImage();
    } else {
      prevImage();
    }
    
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || !hasMultipleImages) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyDown);
      }
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof window !== 'undefined') {
         window.removeEventListener('keydown', handleKeyDown);
      }
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, hasMultipleImages, prevImage, nextImage]);

  return (
    <>
      <div className="flex max-w-xl w-full gap-4 flex-col md:flex-row">
          <div className="grid grid-cols-5 md:flex md:flex-col gap-4 order-2 md:order-1">
            {transformedImages?.map((item, id) => (
              <button
                key={id}
                className={`relative h-16 md:w-20 md:h-20 rounded-md bg-gray-50 overflow-hidden cursor-pointer focus:outline-none transition-all ${
                  id === currentImageIndex 
                    ? "ring-2 ring-blue-500" 
                    : "ring-1 ring-gray-200 hover:ring-blue-300"
                }`}
                onClick={() => openModal(id)}
              >
                <Image
                  src={item}
                  className="object-cover w-full h-full"
                  alt={`Product thumbnail ${id + 1}`}
                  fill={true}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        
        <div className={`relative ${hasMultipleImages ? 'flex-1' : 'w-full'} bg-gray-50 rounded-md overflow-hidden flex items-center justify-center min-h-[300px] cursor-pointer group order-1 md:order-2`}>
          <button 
            onClick={() => openModal(0)}
            className="relative w-140 h-full focus:outline-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={transformedImages?.[currentImageIndex] || "https://picsum.photos/800/600"}
              className="object-fill w-full h-full group-hover:scale-105 transition-transform duration-300"
              alt="Product Image"
              fill={true}
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {hasMultipleImages && (
              <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <ChevronLeft className="w-4 h-4 text-white" />
                <span className="text-white text-xs">Свайп для просмотра</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>

      {isModalOpen && transformedImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 size-10 cursor-pointer rounded-full bg-black/50 hover:bg-black/70 border-none text-white transition-all hover:scale-110"
              variant="outline"
              aria-label="Закрыть"
            >
              <X size={24} />
            </Button>

            {hasMultipleImages && (
              <Button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform cursor-pointer -translate-y-1/2 z-50 size-10 rounded-full bg-black/50 hover:bg-black/70 border-none text-white transition-all hover:scale-110"
                variant="outline"
                aria-label="Предыдущее изображение"
                disabled={isTransitioning}
              >
                <ChevronLeft size={24} />
              </Button>
            )}

            {hasMultipleImages && (
              <Button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform cursor-pointer -translate-y-1/2 z-50 size-10 rounded-full bg-black/50 hover:bg-black/70 border-none text-white transition-all hover:scale-110"
                variant="outline"
                aria-label="Следующее изображение"
                disabled={isTransitioning}
              >
                <ChevronRight size={24} />
              </Button>
            )}

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                {transformedImages.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                      index === currentImageIndex
                        ? direction === 'left'
                          ? isTransitioning
                            ? 'translate-x-full opacity-0'
                            : 'translate-x-0 opacity-100'
                          : direction === 'right'
                          ? isTransitioning
                            ? '-translate-x-full opacity-0'
                            : 'translate-x-0 opacity-100'
                          : 'translate-x-0 opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-fill"
                      sizes="100vw"
                      priority={index === currentImageIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            {hasMultipleImages && (
              <>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {transformedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? "bg-white scale-110" 
                          : "bg-gray-500 hover:bg-gray-300"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                      disabled={isTransitioning}
                    />
                  ))}
                </div>

                <div className="absolute bottom-6 right-6 text-white text-sm bg-black/40 px-3 py-1 rounded-full z-10">
                  {currentImageIndex + 1} / {transformedImages.length}
                </div>
              </>
            )}

            {hasMultipleImages && (
              <div className="md:hidden absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                <span className="text-white text-xs">Свайп для навигации</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};