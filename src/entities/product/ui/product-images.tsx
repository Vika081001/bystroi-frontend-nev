import React from "react";

export const ProductImages = () => {
  return (
    <div className="flex max-w-xl w-full gap-4 flex-col md:flex-row">
      <div className="grid grid-cols-5 md:flex md:flex-col gap-4">
        <div className="h-16 md:w-20 md:h-20 rounded-md bg-gray-50 ring-2 ring-blue-500 overflow-hidden">
          <img
            src="https://picsum.photos/800/600"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="h-16 md:w-20 md:h-20 rounded-md bg-gray-50 overflow-hidden">
          <img
            src="https://picsum.photos/800/600"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="h-16 md:w-20 md:h-20 rounded-md bg-gray-50 overflow-hidden">
          <img
            src="https://picsum.photos/800/600"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="h-16 md:w-20 md:h-20 rounded-md bg-gray-50 overflow-hidden">
          <img
            src="https://picsum.photos/800/600"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="h-16 md:w-20 md:h-20 rounded-md bg-gray-50 overflow-hidden">
          <img
            src="https://picsum.photos/800/600"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src="https://picsum.photos/800/600"
          className="object-cover w-full h-full"
          width={260}
        />
      </div>
    </div>
  );
};
