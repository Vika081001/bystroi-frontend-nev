import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/kit/carousel";
import Image from "next/image";

const Poster = () => {
  const images = [
    "https://b.fotohosting.pro/2025/12/12/DOM-BEZ-KNOPKI.png",
    "https://a.fotohosting.pro/2025/12/12/EDA-BEZ-KNOPKI.png",
    "https://b.fotohosting.pro/2025/12/12/TVETY-2-BEZ-KNOPKI.png",
    "https://a.fotohosting.pro/2025/12/12/TVETY-1-BEZ-KNOPKI.png",
  ];
  
  return (
    <section className="relative pt-6">
      <div className="container">
        <Carousel className="h-56 relative overflow-hidden rounded-lg">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-56 w-full">
                <Image
                  src={image}
                  className="w-full h-full object-fill"
                  alt={`Poster ${index + 1}`}
                  width={1600}
                  height={600}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default Poster;