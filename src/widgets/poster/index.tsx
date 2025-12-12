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
    "https://downloader.disk.yandex.ru/preview/e8ac1c0c9c12787776e1ef7ed557a288b28d552a6d9d2bfee7280c1deba4316d/693c54d7/Y2zqYNYYulNbsMSj0mOHdMQ3SnoOMwcXiZMUOSjbGMr_B-i3QKQ96aWVbnXBq71glklhK5K2pvUvaV_89eTG5g%3D%3D?uid=0&filename=Цветы%201%20%28без%20кнопки%29.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v3&size=2048x2048",
    "https://2.downloader.disk.yandex.ru/preview/d0d5c2341bff85839cac081d64fe383373776bd6b96f8200c72454f850e1cb3c/inf/ZP6QDlKe7FuBdd3K7ALL74vASdK58TSazBPqx3aWvRIXqzoymK6QwxGC-Njcn1VUCTXOL-x269-iQMrqdNLFdA%3D%3D?uid=807831434&filename=Цветы%202%20%28без%20кнопки%29.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=807831434&tknv=v3&size=1920x1080",
    "https://2.downloader.disk.yandex.ru/preview/f92fe061be6b6454b87fcc4f7e8ca3eb249ff5378e2996b91cbd1a69a9d02962/inf/ILcQFLTv-fqSQAnYv587ui21r6FnRJmW00GZ_VacITfPFCCvDKBFKsGQNh1Z6DhnuuHcuoTWgl2sNFbRb6njtg%3D%3D?uid=807831434&filename=Еда%20%28без%20кнопки%29.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=807831434&tknv=v3&size=1920x1080",
    "https://3.downloader.disk.yandex.ru/preview/a7f8da33006d242828d939600a9e762fbc5b70a26bf455ddd1bde7d4a96d204e/inf/tlJCXTUhoJVkfVp-0IjlA5e1YtepN6WUWXt3sNPu5i4ObIUKvyfreiSkV-1H4A8Y_WkMxFy3tgOY9ziyt_75og%3D%3D?uid=807831434&filename=Дом%20%28без%20кнопки%29.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=807831434&tknv=v3&size=1920x1080",
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