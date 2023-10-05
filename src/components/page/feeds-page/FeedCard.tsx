"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { firestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IFeedCard {
  tripId: string;
  onClick: () => void;
}

const FeedCard: React.FC<IFeedCard> = ({ tripId, onClick }) => {
  const [trip, setTrip] = useState<TripType | null>(null);

  const tripDocUnsub = onSnapshot(
    doc(firestore, "trips", tripId),
    (tripDoc) => {
      const _trip = tripDoc.data() as TripType;
      setTrip({ ..._trip, id: tripDoc.id });
    }
  );

  const handleCardClicked = () => {
    if (trip) {
      router.push(`/dashboard/trips/${trip.id}`);
    }
  };

  const router = useRouter();

  const handleRemoveClicked = () => {
    onClick();
  };

  return (
    <div
      onClick={handleCardClicked}
      className="relative flex items-center w-full cursor-pointer bg-white"
    >
      <div className="">
        {trip ? (
          <Image
            alt="Trip Photo"
            width={120}
            height={120}
            src={trip.imageURL}
            className="min-w-[120px] h-[120px] rounded-md bg-cover aspect-square"
          />
        ) : (
          <Skeleton className="min-w-[120px] min-h-[120px] bg-zinc-200/50 rounded-md"></Skeleton>
        )}
      </div>
      <div className="">
        {trip ? (
          <div className="ml-3 flex-grow">
            <div className="text-base font-medium truncate w-full">
              {trip.title}
            </div>
            <div className="text-sm font-light text-zinc-500 mt-2">
              {trip.subtitle}
            </div>
          </div>
        ) : (
          <div className="mx-5">
            <Skeleton className="w-full h-[20px] bg-zinc-200/50 rounded-md"></Skeleton>
            <Skeleton className="w-full h-[16px] bg-zinc-200/50 rounded-md mt-2"></Skeleton>
          </div>
        )}
      </div>
      <div
        onClick={handleRemoveClicked}
        className="absolute right-1 top-1 text-zinc-300 hover:text-zinc-800 active:scale-95 cursor-pointer"
      >
        <AiOutlineClose />
      </div>
    </div>
  );
};

export default FeedCard;
