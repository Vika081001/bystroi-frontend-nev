import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/kit/carousel";

const Poster = () => {
  const images = ["first.png", "second.png", "fourth.jpg", "fifth.png", "airpods.jpeg"];
  
  return (
    <section className="relative pt-6">
      <div className="container">
        <Carousel className="h-56 relative overflow-hidden rounded-lg">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-56 w-full">
                <img
                  src={`/${image}`}
                  className="w-full h-full object-fill"
                  alt={`Poster ${index + 1}`}
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