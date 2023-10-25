"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";

interface IImageDescriptionCard {
  imageDescription: ImageDescriptionType;
  onClick: () => void;
}

const ImageDescriptionCard: React.FC<IImageDescriptionCard> = ({
  imageDescription,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="hover:border-zinc-500 active:scale-95 transition-all cursor-pointer relative border p-1 w-full md:w-[200px] max-w-[600px] rounded-lg"
    >
      <Image
        alt="Place Image"
        src={
          imageDescription.imageURL == ""
            ? "/images/image_placeholder.png"
            : imageDescription.imageURL
        }
        width={768}
        height={200}
        className="h-[150px] object-cover aspect-square rounded-lg"
      />
      <div
        placeholder="Description"
        className="absolute bottom-3 left-3 text-white"
      >
        {imageDescription.title}
      </div>
    </div>
  );
};

interface IImageDescriptionCardSkeleton {
  opacity: number;
}

export const ImageDescriptionCardSkeleton: React.FC<
  IImageDescriptionCardSkeleton
> = ({ opacity }) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <Skeleton
      className={`${opacities[opacity]} w-full md:w-[200px] max-w-[600px] rounded-lg bg-zinc-200/30`}
    ></Skeleton>
  );
};

interface IAddImageDescriptionCard {
  onClick: () => void;
}

export const AddImageDescriptionCard: React.FC<IAddImageDescriptionCard> = ({
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-[160px] text-zinc-500 hover:text-zinc-800 hover:border-zinc-500 active:scale-95 transition-all cursor-pointer relative border border-dashed p-1 w-full md:w-[200px] max-w-[600px] rounded-lg"
    >
      <IoAddCircleOutline
        size={20}
        className="absolute left-[50%] bottom-[50%] translate-x-[-50%] translate-y-[50%]"
      />
    </div>
  );
};

export default ImageDescriptionCard;
