"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { IoAddCircleOutline } from "react-icons/io5";

interface INeedToKnowCard {
  needToKnow: NeedToKnowType;
  onClick: () => void;
}

const NeedToKnowCard: React.FC<INeedToKnowCard> = ({ needToKnow, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="hovers:border-zinc-500 active:scale-95 min-h-[80px] transition-all cursor-pointer relative border p-2 w-full rounded-lg bg-white"
    >
      {needToKnow.title == "" ? needToKnow.description : needToKnow.title}
    </div>
  );
};

interface INeedToKnowCardSkeleton {
  opacity: number;
}

export const NeedToKnowCardSkeleton: React.FC<INeedToKnowCardSkeleton> = ({
  opacity,
}) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <Skeleton
      className={`${opacities[opacity]}  w-full h-[80px] rounded-lg bg-zinc-200/30`}
    ></Skeleton>
  );
};

interface IAddNeedToKnowCard {
  onClick: () => void;
}

export const AddNeedToKnowCard: React.FC<IAddNeedToKnowCard> = ({
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-[80px] text-zinc-500 hover:text-zinc-800 hover:border-zinc-500 active:scale-95 transition-all cursor-pointer relative border border-dashed p-1 w-full rounded-lg"
    >
      <IoAddCircleOutline
        size={20}
        className="absolute left-[50%] bottom-[50%] translate-x-[-50%] translate-y-[50%]"
      />
    </div>
  );
};

export default NeedToKnowCard;
