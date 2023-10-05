"use client";

import React from "react";
import TextWithTooltip from "@/components/common/text/WithTooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface IPaymentCard {
  paymentCard: PaymentCardType;
}

const PaymentCard: React.FC<IPaymentCard> = ({ paymentCard }) => {
  return (
    <div className="w-full lg:w-[280px] border bg-white/50 p-5 rounded-md flex flex-col gap-2">
      <TextWithTooltip tooltip="Full name">
        <div className="className=w-fit break-words text-start">
          {paymentCard.fullName}
        </div>
      </TextWithTooltip>
      <hr />
      <TextWithTooltip tooltip="Billing address">
        <div className="className=w-fit break-words text-start">
          {paymentCard.billingAddress}
        </div>
      </TextWithTooltip>
      <hr />
      <div className="flex items-center gap-5">
        <TextWithTooltip tooltip="City">
          <div className="className=w-fit break-words text-start">
            {paymentCard.city}
          </div>
        </TextWithTooltip>
        <TextWithTooltip tooltip="Zip code">
          <div className="className=w-fit break-words text-start">
            {paymentCard.zipCode}
          </div>
        </TextWithTooltip>
      </div>
      <hr />
      <TextWithTooltip tooltip="Country">
        <div className="className=w-fit break-words text-start">
          {paymentCard.country}
        </div>
      </TextWithTooltip>
    </div>
  );
};

interface IPaymentCardSkeleton {
  opacity: number;
}

export const PaymentCardSkeleton: React.FC<IPaymentCardSkeleton> = ({
  opacity,
}) => {
  const opacities = ["opacity-70", "opacity-50", "opacity-10"];
  return (
    <div
      className={`w-full lg:w-[280px] bg-white/40 animate-pulse p-5 rounded-md flex flex-col gap-2 ${opacities[opacity]}`}
    >
      <Skeleton className="w-[120px] h-[16px] rounded-md bg-zinc-200/30" />
      <Skeleton className="mt-1 w-[180px] h-[16px] rounded-md bg-zinc-200/30" />

      <div className="mt-1 flex items-center gap-5">
        <Skeleton className="w-[100px] h-[16px] rounded-md bg-zinc-200/30" />
        <Skeleton className="w-[70px] h-[16px] rounded-md bg-zinc-200/30" />
      </div>
      <Skeleton className="mt-1 w-[150px] h-[16px] rounded-md bg-zinc-200/30" />
    </div>
  );
};

export default PaymentCard;
