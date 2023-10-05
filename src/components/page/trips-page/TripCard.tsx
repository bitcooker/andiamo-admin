"use client";

import React, { useState } from "react";
import Image from "next/image";
import WithTooltip from "@/components/common/text/WithTooltip";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface ITripCard {
  trip: TripType;
  onRemoveTripClick: (tripToRemove: TripType) => void;
}

const TripCard: React.FC<ITripCard> = ({ trip, onRemoveTripClick }) => {
  const [hover, setHover] = useState(false);

  const router = useRouter();
  const handleEdit = () => {
    router.push(`/dashboard/trips/${trip.id}`);
  };

  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className="shadow-sm lg:w-[250px] h-[200px] relative w-full rounded-xl lg:rounded-none lg:rounded-tl-3xl lg:rounded-br-3xl overflow-clip border hover:shadow-[0_5px_10px_rgb(0,0,0,0.04)] transition-all"
    >
      <Image
        alt="Trip Image"
        width={400}
        height={400}
        src={
          trip.imageURL == "" ? "/images/image_placeholder.png" : trip.imageURL
        }
        className="w-full h-full object-cover"
      />
      {hover && (
        <div className="flex items-center gap-2 absolute top-3 right-3 lg:top-2 lg:right-2">
          <WithTooltip tooltip="Edit Trip" onClick={handleEdit}>
            <BiEdit
              size={20}
              className="opacity-50 hover:opacity-100 active:scale-90 transition-all"
            />
          </WithTooltip>
          <WithTooltip
            tooltip="Remove Trip"
            onClick={() => {
              onRemoveTripClick(trip);
            }}
          >
            <AiOutlineDelete
              size={20}
              className="opacity-50 hover:opacity-100 active:scale-90 transition-all"
            />
          </WithTooltip>
        </div>
      )}
      <div className="absolute text-white bottom-2 left-[50%] translate-x-[-50%] lg:translate-x-0 lg:left-2 p-1 font-medium text-xl lg:text-base text-center lg:text-start">
        {trip.title}
      </div>
    </div>
  );
};

interface ITripCardSkeleton {
  opacity: number;
}

export const TripCardSkeleton: React.FC<ITripCardSkeleton> = ({ opacity }) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <Skeleton
      className={`${opacities[opacity]} lg:w-[250px] h-[200px] relative w-full rounded-xl lg:rounded-none lg:rounded-tl-3xl lg:rounded-br-3xl overflow-clip transition-all bg-zinc-200/30`}
    />
  );
};

export default TripCard;
