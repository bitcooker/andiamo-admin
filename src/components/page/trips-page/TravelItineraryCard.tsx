"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";

interface ITravelItineraryCard {
  itinerary: TravelitineraryType;
  onClick: () => void;
}

const TravelItineraryCard: React.FC<ITravelItineraryCard> = ({
  itinerary,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="hover:border-zinc-500 active:scale-95 transition-all cursor-pointer relative border p-3 w-full h-[80px] rounded-lg flex flex-col justify-center bg-white"
    >
      <div className="text-yellow-400 flex items-center gap-1">
        <div className="font-bold">{`Day ${itinerary.day}:`}</div>
        <div>{itinerary.itinerary}</div>
      </div>
      <div className="text-zinc-500">
        {itinerary.date.toDate().toLocaleDateString()}
      </div>
    </div>
  );
};

interface ITravelItineraryCardSkeleton {
  opacity: number;
}

export const TravelItineraryCardSkeleton: React.FC<
  ITravelItineraryCardSkeleton
> = ({ opacity }) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <Skeleton
      className={`${opacities[opacity]}  w-full h-[80px] rounded-lg bg-zinc-200/30`}
    ></Skeleton>
  );
};

interface IAddTravelItineraryCard {
  onClick: () => void;
}

export const AddTravelItineraryCard: React.FC<IAddTravelItineraryCard> = ({
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

export default TravelItineraryCard;
