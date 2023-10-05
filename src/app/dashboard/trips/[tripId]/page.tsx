import React from "react";
import ClientOnly from "@/components/common/ClientOnly";
import TripClient from "./TripClient";

interface IPageParams {
  params: {
    tripId: string;
  };
}

export default function TripPage({ params: { tripId } }: IPageParams) {
  return (
    <ClientOnly>
      <TripClient tripId={tripId} />
    </ClientOnly>
  );
}
