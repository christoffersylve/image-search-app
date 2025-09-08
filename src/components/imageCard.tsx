import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronDown, Download } from "lucide-react";
import { UnsplashImage } from "@/types/unsplash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

const ImageCard = ({
  image,
  isLoading,
}: {
  image: UnsplashImage;
  isLoading: boolean;
}) => {
  const handleDownload = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "unsplash-image.jpg"; // You can customize the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  {
    /* TODO: Calculate the acctual size from URL */
  }
  const sizes = [
    { label: "Small", value: image.urls.small },
    { label: "Medium", value: image.urls.regular },
    { label: "Large", value: image.urls.full },
    { label: "Original Size", value: image.urls.raw },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md cursor-pointer ">
          <>
            {/* Image */}
            <Image
              src={image.urls.regular}
              alt={"Unsplash image"}
              fill
              sizes="100%"
              className="object-cover transition-transform duration-300 group-hover:scale-101"
              priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Download button */}
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-md"
                onClick={() => handleDownload(image.urls.regular)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="pb-2">
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <Image
              src={image.user.profile_image.medium}
              alt="Photographer profile"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{image.user.name}</p>
              {image.user.portfolio_url && (
                <a
                  href={image.user.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
          <p>
            <strong>Description:</strong>{" "}
            {image.description || image.alt_description || "N/A"}
          </p>
          <p>
            <strong>Dimensions:</strong> ({image.width} x {image.height})
          </p>
          <p>
            <strong>Likes:</strong> {image.likes}
          </p>
          <div className="inline-flex rounded-md" role="group">
            {/* Main Download Action */}
            <Button
              variant="outline"
              className="rounded-r-none"
              onClick={() => handleDownload("full")} // default action
            >
              Download
            </Button>

            {/* Dropdown for options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-l-none px-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sizes.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => handleDownload(opt.value)}
                  >
                    <strong>{opt.label}</strong>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {/* <Button type="button" variant="secondary">
              Close
            </Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCard;
