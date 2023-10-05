"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface IImageInput {
  image: string;
  disabled?: boolean;
  onImageChange: (value: any) => void;
}

const ImageInput: React.FC<IImageInput> = ({
  image,
  onImageChange,
  disabled = false,
}) => {
  const fileRef = useRef(null);

  const handleButtonClick = () => {
    if (image == "") {
      (fileRef.current as any).click();
    } else {
      onImageChange(undefined);
    }
  };

  const handleImageChange = () => {
    const [file] = (fileRef.current as any).files;
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col w-full h-full m-3 border border-dashed rounded-xl p-2">
      <div className="flex w-full h-full relative">
        {!disabled && (
          <div
            className="absolute cursor-pointer transition-all text-zinc-400 hover:text-zinc-700 flex flex-col justify-center items-center w-fit h-fit p-2 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
            onClick={handleButtonClick}
          >
            {image != "" ? (
              <IoRemoveCircleOutline size={26} />
            ) : (
              <IoAddCircleOutline size={26} />
            )}
          </div>
        )}

        {image != "" && (
          <div className="flex w-full h-full border rounded-xl">
            <Image
              alt="Chat Image"
              width={300}
              height={250}
              className="object-cover aspect-square w-full rounded-xl"
              src={image}
            />
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      ></input>
    </div>
  );
};

export default ImageInput;
