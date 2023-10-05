"use client";

import React from "react";
import TextWithTooltip from "@/components/common/text/WithTooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface IPassportCard {
  passport: PassportCardType;
}

const PassportCard: React.FC<IPassportCard> = ({ passport }) => {
  return (
    <div className="w-full lg:w-[280px] border bg-white/50 p-5 rounded-md flex flex-col gap-2">
      <TextWithTooltip tooltip="Full Name">
        <div className="className=w-fit break-words text-start">
          {passport.fullName}
        </div>
      </TextWithTooltip>
      <hr />
      <TextWithTooltip tooltip="Passport number">
        <div className="className=w-fit break-words text-start">
          {passport.passportNumber}
        </div>
      </TextWithTooltip>
      <hr />
      <TextWithTooltip tooltip="Nationality">
        <div className="className=w-fit break-words text-start">
          {passport.nationality}
        </div>
      </TextWithTooltip>
      <hr />
      <div className="flex items-center gap-5">
        <div>
          <div className="text-xs text-zinc-400">Date of issue:</div>
          <TextWithTooltip tooltip="Date of issue">
            <div className="className=w-fit break-words text-start">
              {passport.dateOfIssue.toDate().toLocaleDateString()}
            </div>
          </TextWithTooltip>
        </div>
        <div>
          <div className="text-xs text-zinc-400">Date of expiry:</div>
          <TextWithTooltip tooltip="Date of expiry">
            <div className="className=w-fit break-words text-start">
              {passport.dateOfExpiry.toDate().toLocaleDateString()}
            </div>
          </TextWithTooltip>
        </div>
      </div>
    </div>
  );
};

interface IPassportCardSkeleton {
  opacity: number;
}

export const PassportCardSkeleton: React.FC<IPassportCardSkeleton> = ({
  opacity,
}) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <div
      className={`w-full lg:w-[280px] bg-white/40 animate-pulse p-5 rounded-md flex flex-col gap-2 ${opacities[opacity]}`}
    >
      <Skeleton className="w-[120px] h-[16px] rounded-md bg-zinc-200/30" />
      <Skeleton className="mt-1 w-[180px] h-[16px] rounded-md bg-zinc-200/30" />
      <Skeleton className="mt-1 w-[150px] h-[16px] rounded-md bg-zinc-200/30" />
      <div className="mt-1 flex items-center gap-5">
        <Skeleton className="w-[100px] h-[32px] rounded-md bg-zinc-200/30" />
        <Skeleton className="w-[70px] h-[32px] rounded-md bg-zinc-200/30" />
      </div>
    </div>
  );
};

export default PassportCard;
