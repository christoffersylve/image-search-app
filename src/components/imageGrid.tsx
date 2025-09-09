import React from "react";
import { UnsplashImage } from "@/types/unsplash";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import ImageCard from "./ImageCard";

const ImageGrid = ({
  nbrImagesPerPage,
  images,
  isLoading,
}: {
  nbrImagesPerPage: number;
  images: UnsplashImage[];
  isLoading: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4 w-full">
      {isLoading ? (
        <>
          {Array.from({ length: nbrImagesPerPage }).map((_, i) => (
            <Card
              key={i}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md"
            >
              <Skeleton className="absolute inset-0 h-full w-full" />
            </Card>
          ))}
        </>
      ) : (
        <>
          {images.length === 0 && !isLoading && (
            <div className="col-span-full text-center">
              <p>No images found.</p>
            </div>
          )}
          {images.map((image) => (
            <ImageCard key={image.id} image={image} isLoading={isLoading} />
          ))}
        </>
      )}
    </div>
  );
};

export default ImageGrid;
